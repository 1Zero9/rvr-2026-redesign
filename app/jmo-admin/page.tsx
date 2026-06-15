import Header from "@/components/Header";
import JmoAdminTool from "@/components/jmo/JmoAdminTool";

export default function JmoAdminPage() {
  return (
    <div className="min-h-screen bg-brand-cream">
      <Header />
      <main>
        <JmoAdminTool />
      </main>
    </div>
  );
}
