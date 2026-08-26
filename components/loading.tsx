import Image from 'next/image';

export default function Loading() {
  return (
    <div className="grid h-full place-content-center">
      <div className="flex flex-col items-center text-gray-500">
        <Image
          src="https://upload.wikimedia.org/wikipedia/commons/5/53/Pok%C3%A9_Ball_icon.svg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original"
          alt="logo"
          width={100}
          height={100}
          className="animate-spin"
        />
        <h1>Loading...</h1>
      </div>
    </div>
  );
}
