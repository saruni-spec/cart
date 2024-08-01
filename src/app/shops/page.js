import React from "react";
import Link from "next/link";

export async function getServerSideProps() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/shops`);
  const shops = await res.json();

  return { props: { items } };
}

const Shops = ({ shops }) => {
  <ul>
    {shops.map((shop) => (
      <li key={shop.shop_id}>
        {" "}
        <Link href={`/shops/${shop.shop_id}`}>{shop.name}</Link>
      </li>
    ))}
  </ul>;
};

export default Shops;
