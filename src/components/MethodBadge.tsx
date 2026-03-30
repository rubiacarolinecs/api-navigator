const methodColors: Record<string, string> = {
  GET: "bg-method-get/15 text-method-get border-method-get/30",
  POST: "bg-method-post/15 text-method-post border-method-post/30",
  PUT: "bg-method-put/15 text-method-put border-method-put/30",
  PATCH: "bg-method-patch/15 text-method-patch border-method-patch/30",
  DELETE: "bg-method-delete/15 text-method-delete border-method-delete/30",
};

export const MethodBadge = ({ method }: { method: string }) => {
  const classes = methodColors[method] || "bg-muted text-muted-foreground border-border";
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded font-mono text-xs font-semibold border ${classes}`}>
      {method}
    </span>
  );
};
