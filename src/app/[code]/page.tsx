type PageProps = {
  params: { code: string };
};

export default function Page({ params }: PageProps) {
  return <p>{params.code}</p>;
}
