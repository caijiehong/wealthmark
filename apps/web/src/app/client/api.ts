import { PropertyAttributes, PropertyHisAttributes } from "../lib/db";

export async function fetchProperty(id: number) {
  const res = await fetch(`/api/property?id=${id}`);
  const {
    data,
  }: {
    data: {
      property: PropertyAttributes;
      propertyHis: PropertyHisAttributes[];
    };
  } = await res.json();
  return data;
}
