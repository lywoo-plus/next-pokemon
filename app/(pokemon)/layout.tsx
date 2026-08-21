export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="my-8 flex flex-col gap-4 px-4 md:mx-auto md:flex-row">
      {children}
    </section>
  );
}
