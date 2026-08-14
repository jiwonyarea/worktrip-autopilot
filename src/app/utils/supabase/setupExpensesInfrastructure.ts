import { createClient } from "@supabase/supabase-js";

export async function setupExpensesInfrastructure(projectId: string, publicAnonKey: string) {
  const supabase = createClient(
    `https://${projectId}.supabase.co`,
    publicAnonKey
  );

  try {
    console.log("Setting up expenses infrastructure...");

    // Call the setup Edge Function
    const { data, error } = await supabase.functions.invoke("setupExpenses", {
      body: {},
    });

    if (error) {
      console.error("Setup error:", error);
      return { success: false, error };
    }

    console.log("Setup complete:", data);
    return { success: true, data };
  } catch (error) {
    console.error("Setup failed:", error);
    return { success: false, error };
  }
}
