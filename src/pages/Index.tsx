import { WorkspaceSwitcher } from "@/components/WorkspaceSwitcher";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header with Workspace Switcher */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-2xl font-bold text-primary">Postman</div>
              <WorkspaceSwitcher />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Welcome back!</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl">
          <h1 className="text-3xl font-bold mb-4">Workspace Switcher Redesign</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Experience the new intelligent workspace navigation that puts your most important workspaces first.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Key Features</h2>
              <ul className="space-y-2 text-muted-foreground">
                <li>⭐ <strong>Favorite workspaces</strong> - Star what matters most</li>
                <li>🏷️ <strong>Clear workspace metadata</strong> - Know who created what</li>
                <li>🎯 <strong>Current workspace indicator</strong> - Always know where you are</li>
                <li>🔔 <strong>Activity notifications</strong> - See what needs attention</li>
                <li>🔍 <strong>Smart search</strong> - Find by name or creator</li>
                <li>⚡ <strong>Quick actions</strong> - Create new or browse all</li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Solves Key Problems</h2>
              <ul className="space-y-2 text-muted-foreground">
                <li>✅ No more confusion between "My Workspace" entries</li>
                <li>✅ Favorites don't get buried in recent history</li>
                <li>✅ Public workspaces don't pollute your list</li>
                <li>✅ Clear visual indicators for workspace types</li>
                <li>✅ Fast navigation to frequently used spaces</li>
                <li>✅ Encourages shared workspace discovery</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
