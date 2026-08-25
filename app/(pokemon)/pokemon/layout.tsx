export default function Layout({ children, modal }: LayoutProps<'/pokemon'>) {
  return (
    <>
      {children}
      {modal}
    </>
  );
}
