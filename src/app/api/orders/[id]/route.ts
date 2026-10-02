import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser, requireAuth } from "@/lib/auth";
import { sendOrderStatusEmail } from "@/lib/email";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser();
    const { id } = await context.params;

    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id }, { orderNumber: id }],
      },
      include: {
        items: {
          include: {
            product: { select: { slug: true } },
          },
        },
        payments: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Security check: if not admin, ensure the order belongs to the requester
    if (order.userId && (!user || (user.id !== order.userId && user.role !== "ADMIN"))) {
      return NextResponse.json({ error: "Unauthorized to view this order" }, { status: 403 });
    }

    let shippingAddress = {};
    let billingAddress = {};
    try {
      shippingAddress = JSON.parse(order.shippingAddress);
    } catch {}
    try {
      billingAddress = JSON.parse(order.billingAddress);
    } catch {}

    return NextResponse.json({
      order: {
        ...order,
        shippingAddress,
        billingAddress,
        createdAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Order details error:", error);
    return NextResponse.json({ error: "Failed to fetch order details" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await context.params;
    const { orderStatus, trackingNumber, paymentStatus } = await req.json();

    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id }, { orderNumber: id }],
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Customer can only cancel their own PENDING / CONFIRMED order
    if (user.role !== "ADMIN") {
      if (order.userId !== user.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      }
      if (orderStatus !== "CANCELLED") {
        return NextResponse.json({ error: "Customers can only request cancellation" }, { status: 400 });
      }
      if (order.orderStatus === "SHIPPED" || order.orderStatus === "DELIVERED") {
        return NextResponse.json({ error: "Order is already dispatched and cannot be cancelled" }, { status: 400 });
      }
    }

    const data: any = {};
    if (orderStatus) data.orderStatus = orderStatus;
    if (trackingNumber !== undefined) data.trackingNumber = trackingNumber;
    if (paymentStatus && user.role === "ADMIN") data.paymentStatus = paymentStatus;

    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data,
    });

    // Notify customer on status update
    if (orderStatus && orderStatus !== order.orderStatus) {
      sendOrderStatusEmail(
        updatedOrder.customerEmail,
        updatedOrder.orderNumber,
        orderStatus,
        trackingNumber || updatedOrder.trackingNumber
      ).catch((err) => console.error("Email notification error:", err));
    }

    return NextResponse.json({
      message: "Order updated successfully",
      order: updatedOrder,
    });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Order status update error:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
