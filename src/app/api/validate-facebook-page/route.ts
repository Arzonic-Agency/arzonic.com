import { NextResponse } from "next/server";

export async function POST() {
  try {
    console.log("🔍 [API] Validating Facebook page access after auth...");

    // Try different import approach
    const someModule = await import("@/lib/server/some");
    console.log("🔍 [API] Available exports:", Object.keys(someModule));

    if (typeof someModule.validateFacebookPageAccess !== "function") {
      console.error(
        "❌ [API] validateFacebookPageAccess is not a function, type:",
        typeof someModule.validateFacebookPageAccess
      );
      return NextResponse.json(
        { hasAccess: false, error: "Function not available" },
        { status: 200 }
      );
    }

    const validation = await someModule.validateFacebookPageAccess();

    console.log("🔍 [API] Validation result:", validation);

    return NextResponse.json(validation, { status: 200 });
  } catch (error) {
    console.error("❌ [API] Error validating Facebook page access:", error);
    return NextResponse.json(
      { hasAccess: false, error: "Internal server error" },
      { status: 200 }
    );
  }
}
