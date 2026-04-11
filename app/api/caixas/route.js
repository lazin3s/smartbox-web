import { supabase } from '../../supabase';

export async function POST(req) {
  const { codigo, box_id } = await req.json();

  const { data, error } = await supabase
    .from("test")
    .select("*")
    .eq("codigo", codigo)
    .eq("box_id", box_id)
    .eq("usado", false)
    .single();

  if (error || !data) {
    return Response.json({ valido: false });
  }

  // 🔥 valida expiração
  if (data.expira_em) {
    const agora = new Date();
    const expira = new Date(data.expira_em);

    if (agora > expira) {
      return Response.json({ valido: false, motivo: "expirado" });
    }
  }

  // marca como usado
  await supabase
    .from("test")
    .update({ usado: true })
    .eq("id", data.id);

  return Response.json({ valido: true });
}