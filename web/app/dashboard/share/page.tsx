export default function SharePage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Share</h1>
      <p className="mt-1 text-muted-foreground">
        Share your tournaments and brackets with others.
      </p>
      <div className="mt-8 rounded-lg border border-dashed p-8 text-center text-muted-foreground">
        <p>Each tournament has a public link you can share.</p>
        <p className="mt-1 text-sm">
          Open a tournament and use the Share option there.
        </p>
      </div>
    </div>
  );
}
