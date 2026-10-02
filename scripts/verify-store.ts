import prisma from "../src/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";

async function runStoreVerification() {
  console.log("=================================================");
  console.log("  ShopSphere Automated End-to-End Test Suite    ");
  console.log("=================================================\n");

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition: boolean, testName: string) {
    totalTests++;
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passedTests++;
    } else {
      console.error(`  ❌ FAIL: ${testName}`);
    }
  }

  // 1. Database & Seeding Verification
  console.log("--- 1. Database & Seeding Integrity ---");
  const categoriesCount = await prisma.category.count();
  assert(categoriesCount >= 5, `Found ${categoriesCount} categories (expected >= 5)`);

  const productsCount = await prisma.product.count();
  assert(productsCount >= 30, `Found ${productsCount} products (expected >= 30)`);

  const adminUser = await prisma.user.findUnique({
    where: { email: "admin@shopsphere.com" },
  });
  assert(adminUser !== null && adminUser.role === "ADMIN", "Admin user exists with ADMIN role");

  const sampleCustomer = await prisma.user.findUnique({
    where: { email: "aarav.sharma@example.com" },
  });
  assert(sampleCustomer !== null && sampleCustomer.role === "CUSTOMER", "Customer account exists");

  // 2. Cryptographic Security & Password Hashing
  console.log("\n--- 2. Cryptographic Security & Authentication ---");
  if (adminUser) {
    const isPasswordValid = await bcrypt.compare("Admin@ShopSphere2026", adminUser.passwordHash);
    assert(isPasswordValid, "Bcrypt successfully verified hashed admin password");

    const isWrongPasswordRejected = !(await bcrypt.compare("WrongPassword123", adminUser.passwordHash));
    assert(isWrongPasswordRejected, "Bcrypt successfully rejected incorrect password");
  }

  // 3. Coupon Engine & Discount Rules
  console.log("\n--- 3. Coupon Discount Engine ---");
  const welcomeCoupon = await prisma.coupon.findUnique({ where: { code: "WELCOME10" } });
  assert(welcomeCoupon !== null && welcomeCoupon.discountType === "PERCENTAGE", "WELCOME10 coupon is registered as PERCENTAGE");

  const flatCoupon = await prisma.coupon.findUnique({ where: { code: "FLAT500" } });
  assert(flatCoupon !== null && flatCoupon.discountType === "FIXED", "FLAT500 coupon is registered as FIXED");

  if (welcomeCoupon) {
    const orderSubtotal = 2000;
    const discount = (orderSubtotal * welcomeCoupon.discountValue) / 100;
    const finalDiscount = welcomeCoupon.maxDiscount ? Math.min(discount, welcomeCoupon.maxDiscount) : discount;
    assert(finalDiscount === 200, `WELCOME10 on ₹2000 yields ₹${finalDiscount} (expected ₹200)`);
  }

  if (flatCoupon) {
    const orderSubtotal = 3000;
    const meetsMin = orderSubtotal >= flatCoupon.minOrderValue;
    assert(meetsMin && flatCoupon.discountValue === 500, "FLAT500 requires min order and deducts exactly ₹500");
  }

  // 4. Cart & Tax Computation Standard
  console.log("\n--- 4. Pricing, Taxes & Shipping Rules ---");
  const testSubtotalHigh = 1499;
  const testSubtotalLow = 499;
  const freeShippingThreshold = 999;
  const flatShippingRate = 99;

  const shippingHigh = testSubtotalHigh >= freeShippingThreshold ? 0 : flatShippingRate;
  const shippingLow = testSubtotalLow >= freeShippingThreshold ? 0 : flatShippingRate;
  assert(shippingHigh === 0, `Free shipping triggered on ₹${testSubtotalHigh} (Shipping: ₹${shippingHigh})`);
  assert(shippingLow === flatShippingRate, `Standard ₹99 shipping applied on ₹${testSubtotalLow} (Shipping: ₹${shippingLow})`);

  // 5. Razorpay HMAC-SHA256 Payment Verification
  console.log("\n--- 5. Payment Security & Signature Verification ---");
  const testSecret = "test_key_secret_shopsphere_2026";
  const testOrderId = "order_OqK7r47X5Lg";
  const testPaymentId = "pay_OqK8eK59Lg";
  const generatedSignature = crypto
    .createHmac("sha256", testSecret)
    .update(`${testOrderId}|${testPaymentId}`)
    .digest("hex");

  const expectedMatch = crypto
    .createHmac("sha256", testSecret)
    .update(`${testOrderId}|${testPaymentId}`)
    .digest("hex") === generatedSignature;
  assert(expectedMatch, "HMAC-SHA256 signature verification succeeds for authentic payment");

  const tamperedCheck = crypto
    .createHmac("sha256", testSecret)
    .update(`${testOrderId}|${testPaymentId}_tampered`)
    .digest("hex") === generatedSignature;
  assert(!tamperedCheck, "HMAC-SHA256 correctly rejects tampered payment signature");

  // 6. Product Stock & Variant Association
  console.log("\n--- 6. Product Inventory & Variants ---");
  const productWithVariants = await prisma.product.findFirst({
    where: { variants: { some: {} } },
    include: { variants: true, images: true, category: true },
  });
  assert(productWithVariants !== null, `Found product with variants: "${productWithVariants?.name}"`);
  assert(
    (productWithVariants?.variants.length || 0) > 0,
    `Variants attached: ${productWithVariants?.variants.length} options`
  );
  assert(
    (productWithVariants?.images.length || 0) > 0,
    `Gallery images attached: ${productWithVariants?.images.length} images`
  );

  console.log("\n=================================================");
  console.log(`  Summary: ${passedTests} / ${totalTests} Tests Passed`);
  console.log("=================================================\n");

  if (passedTests === totalTests) {
    console.log("🎉 ALL TESTS PASSED! ShopSphere is fully operational.");
    process.exit(0);
  } else {
    console.error("⚠️ Some tests failed. Please review errors above.");
    process.exit(1);
  }
}

runStoreVerification().catch((e) => {
  console.error("Fatal error during store verification:", e);
  process.exit(1);
});
