export default function DetailBlock({
  label,
  value,
  meta,
}: {
  label: string
  value: string
  meta?: string
}) {
  return (
    <div className="rounded-2xl border p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 font-medium text-foreground">{value}</p>
      {meta ? <p className="mt-2 text-sm text-muted-foreground">{meta}</p> : null}
    </div>
  )
}
