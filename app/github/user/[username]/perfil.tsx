"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AtSignIcon, MapPin, Github } from "lucide-react";
import { User } from "@/app/types";
import { bg7 } from "@/app/estilos";

export default function PerfilCard({ user }: { user: User }) {
  return (
    <div className="flex flex-col w-full max-w-[400px] min-w-50 items-center">
      <div className="flex-1 w-full ">
        <Card style={bg7}>
          <CardHeader className="flex flex-col items-center text-center gap-4 w-full">
            <div className="flex flex-col items-center text-center w-full">
              <Avatar className="w-full h-full">
                <AvatarImage src={user.avatar_url} alt={user.login} />
              </Avatar>
              <CardTitle className="text-[clamp(1rem,2vw,10rem)] font-bold break-words">
                {user.name || user.login}
              </CardTitle>
            </div>

            <div className="w-full space-y-1 text-left font-semibold">
              <p className="flex items-center gap-1 italic truncate">
                <AtSignIcon className="size-3 shrink-0" />
                {user.login}
              </p>
              {user.bio && <p>{user.bio}</p>}
              {user.email && <p>{user.email}</p>}
              {user.location && (
                <p className="flex items-center gap-1 truncate">
                  <MapPin className="size-3 shrink-0" />
                  {user.location}
                </p>
              )}
              {user.html_url && (
                <Button className="!px-0" variant="link" asChild>
                  <Link
                    className="truncate"
                    href={user.html_url}
                    target="_blank"
                  >
                    <Github /> Ver no GitHub
                  </Link>
                </Button>
              )}
            </div>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
