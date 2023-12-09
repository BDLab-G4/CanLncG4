

export const GET = (req: Request, res: Response) => {
  return Response.json({ message: "hello world" }, { status: 200 });
};
