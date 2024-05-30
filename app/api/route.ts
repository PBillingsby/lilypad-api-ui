import { NextRequest, NextResponse } from 'next/server';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

async function fetchWithRetry(url: string, options: AxiosRequestConfig, retries = 5, delay = 1000): Promise<AxiosResponse> {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`Attempt ${i + 1} to fetch from ${url}`);
      const response = await axios(url, options);
      console.log(`Successful response on attempt ${i + 1}`);
      return response;
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error);
      if (i < retries - 1) {
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(res => setTimeout(res, delay));
      } else {
        console.error('Max retries reached');
        throw error;
      }
    }
  }
  throw new Error('Max retries reached');
}

export async function POST(req: NextRequest) {
  try {
    console.log('Received POST request');
    const { inputs } = await req.json();
    console.log('Parsed request body:', { inputs });

    const pk = process.env.PK;
    if (!pk) {
      throw new Error('PK environment variable is not set');
    }
    const module = "ollama-pipeline:llama3-8b-lilypad1";

    const body = {
      pk: pk,
      module: module,
      inputs: `-i Prompt='${inputs}'`,
      opts: { stream: true }
    };

    console.log('Constructed request body:', body);

    const requestOptions: AxiosRequestConfig = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      data: body,
      timeout: 180000 // 3 minutes timeout
    };

    console.log('Request options:', requestOptions);

    const response = await fetchWithRetry("http://js-cli-wrapper.lilypad.tech", requestOptions);
    const data = response.data;
    debugger
    console.log("Received response from Lilypad:", data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error during POST request:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
