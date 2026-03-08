import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req) => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, serviceRoleKey);

  const adminEmail = "flane.klaneh@mail.ru";
  const adminPassword = "Admin123!";

  // Check if user exists
  const { data: { users } } = await supabase.auth.admin.listUsers();
  let userId: string;
  
  const existingUser = users?.find((u: any) => u.email === adminEmail);
  if (existingUser) {
    userId = existingUser.id;
  } else {
    const { data, error } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
    });
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    userId = data.user.id;
  }

  // Assign admin role
  const { error: roleError } = await supabase.from("user_roles").upsert(
    { user_id: userId, role: "admin" },
    { onConflict: "user_id,role" }
  );

  if (roleError) return new Response(JSON.stringify({ error: roleError.message }), { status: 400 });

  return new Response(JSON.stringify({ success: true, userId }), {
    headers: { "Content-Type": "application/json" },
  });
});
