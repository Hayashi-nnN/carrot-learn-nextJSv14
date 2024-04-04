import { NextRequest } from "next/server";

export async function GET(request) {
	return Response.json({
		ok: true
	})
}

export async function POST(request) {
	const data = await request.json();
	return Response.json(data);
}