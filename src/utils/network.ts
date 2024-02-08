const CORSHeaders: { [header: string]: string } = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
};

export const commonJSONResponseHeaders: { [header: string]: string } = {
    "Content-Type": "application/json",
    ...CORSHeaders,
};