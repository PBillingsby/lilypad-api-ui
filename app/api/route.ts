import { type NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const { inputs } = await request.json();
  const pk = process.env.PK;
  const moduleName = "sdxl-pipeline:v0.9-base-lilypad3";
  const module = "cowsay:v0.0.3"
  const body = JSON.stringify({
    pk,
    module: module,
    // inputs: `Prompt='${inputs}'`,
    inputs: `Message='${inputs}'`,
    opts: { stream: true }
  });

  console.log("Before POST to Lilypad")
  const res = await fetch("http://js-cli-wrapper.lilypad.tech", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content': 'application.json',
    },
    body: body,
  })

  console.log("After POST to Lilypad")

  const data = await res.text()

  return Response.json(data)
}