import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import Openfort, { CreateWeb3ConnectionRequest } from "@openfort/openfort-node";

const openfort = new Openfort(process.env.OF_API_KEY);
const CHAIN_ID = 11155111;

function isValidRequestBody(body: any): boolean {
  return typeof body?.FunctionArgument?.playerId === 'string' &&
         typeof body?.FunctionArgument?.chainId === 'number' &&
         typeof body?.FunctionArgument?.uri === 'string' &&
         body?.CallerEntityProfile?.Lineage?.MasterPlayerAccountId;
}

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  try {
    context.log("Starting HTTP trigger function processing.");

    if (!isValidRequestBody(req.body)) {
      context.log("Invalid request body received.");
      context.res = { status: 400, body: "Please pass a valid request body" };
      return;
    }

    const { playerId, chainId, uri } = req.body.FunctionArgument;

    context.log(playerId);
    context.log(chainId);
    context.log(uri);

    const connectionRequest: CreateWeb3ConnectionRequest = {
      player: playerId,
      chainId: CHAIN_ID,
      uri: uri
  };

    const response = await openfort.web3Connections.create(connectionRequest);

    context.log("RESPONSE PLAYER: " + response.player);

    if (!response) {
      context.res = { status: 204, body: "No content received from Openfort API." };
      return;
    }

    context.log(response);
    context.res = { status: 200, body: response.id };
    context.log("API call was successful and response sent.");
  } catch (error) {
    context.log("Unhandled error occurred:", error);
    context.res = { status: 500, body: JSON.stringify(error) };
  }
};

export default httpTrigger;