import React from "react";
import Link from "next/link";

export async function getServerSideProps() {
  const shops = "fetch data";

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
