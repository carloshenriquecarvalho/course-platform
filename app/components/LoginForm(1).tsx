"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const spacingOptions = [
  {
    className: "[--card-spacing:--spacing(4)]",
    label: "16px",
    value: "4",
  },
  {
    className: "[--card-spacing:--spacing(5)]",
    label: "20px",
    value: "5",
  },
  {
    className: "[--card-spacing:--spacing(6)]",
    label: "24px",
    value: "6",
  },
  {
    className: "[--card-spacing:--spacing(8)]",
    label: "32px",
    value: "8",
  },
]

export function CardSpacing() {
  const [spacing, setSpacing] = React.useState("6")
  const selectedSpacing = spacingOptions.find(
    (option) => option.value === spacing
  )

  return (
    <div className="mx-auto grid w-full max-w-sm gap-4">
      <Card className={selectedSpacing?.className}>
        <CardHeader>
          <CardTitle>Faça login na para acessar a plataforma</CardTitle>
          <CardDescription>
            Coloque seu email e senha fornecidos.
          </CardDescription>
          <CardAction>
            <Button variant="link" className="cursor-pointer">Registre</Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email-spacing">Email</Label>
                <Input
                  id="email-spacing"
                  type="email"
                  placeholder="m@exemplo.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password-spacing">Senha</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Esqueceu a senha?
                  </a>
                </div>
                <Input id="password-spacing" type="password" required />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-400 duration-400 cursor-pointer text-black">
            Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
