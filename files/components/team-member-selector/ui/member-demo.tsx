"use client";

import * as React from "react";
import { MemberSelector, type Member } from "@/components/ui/member-selector";

function avatar(seed: string) {
  return `https://api.dicebear.com/9.x/micah/svg?seed=${encodeURIComponent(
    seed,
  )}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
}

export const members: Member[] = [
  {
    id: "1",
    name: "Yuki Tanaka",
    email: "yuki.tanaka@company.com",
    avatar: avatar("Yuki Tanaka"),
  },
  {
    id: "2",
    name: "Matt Cooper",
    email: "matt.cooper@company.com",
    avatar: avatar("Matt Cooper"),
  },
  {
    id: "3",
    name: "Sofia Martinez",
    email: "sofia.martinez@company.com",
    avatar: avatar("Sofia Martinez"),
  },
  {
    id: "4",
    name: "Richard Weber",
    email: "richard.weber@company.com",
    avatar: avatar("Richard Weber"),
  },
  {
    id: "5",
    name: "Emma O'Brien",
    email: "emma.obrien@company.com",
    avatar: avatar("Emma O'Brien"),
  },
  {
    id: "6",
    name: "Jake Morrison",
    email: "jake.morrison@company.com",
    avatar: avatar("Jake Morrison"),
  },
  {
    id: "7",
    name: "Tony Russo",
    email: "tony.russo@company.com",
    avatar: avatar("Tony Russo"),
  },
  {
    id: "8",
    name: "Luna Chen",
    email: "luna.chen@company.com",
    avatar: avatar("Luna Chen"),
  },
];

export function Demo() {
  const [selected, setSelected] = React.useState<string[]>(["1", "2"]);

  return (
    <MemberSelector
      members={members}
      selected={selected}
      onChange={setSelected}
      maxVisible={5}
      label="Participants"
    />
  );
}

export default Demo;
