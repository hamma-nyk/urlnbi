import { supabase } from "@/lib/supabaseClient";

export async function getServerSideProps({ params }) {
  const { data } = await supabase
    .from("urls")
    .select("long_url")
    .eq("short_code", params.code)
    .single();

  if (!data) {
    return { notFound: true };
  }

  return {
    redirect: {
      destination: data.long_url,
      permanent: false,
    },
  };
}

export default function RedirectPage() {
  return <p>Redirecting...</p>;
}
