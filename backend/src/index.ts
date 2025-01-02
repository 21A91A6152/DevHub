import { VercelRequest, VercelResponse } from "@vercel/node";
import app from "./app";

export default (req: VercelRequest, res: VercelResponse) => {
  app(req as any, res as any);
};

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is listening at port ${PORT}`);
});
 
