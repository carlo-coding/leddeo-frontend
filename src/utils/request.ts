import { checkError, IErrorCodeMessages } from "./checkError";
import { getCookie } from "./cookies";

const apiUrl = import.meta.env.VITE_API_URL as string;
const apiPrefix = import.meta.env.VITE_API_PREFIX as string;

interface IRequestParams<R> {
  endpoint: string;
  method?: string;
  body?: any;
  headers?: any;
  mapper?: { (r: any): R };
  preSend?: (p: any) => any;
  codeMessages?: IErrorCodeMessages;
  isBlob?: boolean;
  isProtected?: boolean;
  usesPrefix?: boolean;
}

export async function request<R>({
  endpoint = "",
  method = "GET",
  isBlob = false,
  isProtected = false,
  usesPrefix = true,
  body,
  headers,
  mapper,
  preSend,
  codeMessages,
}: IRequestParams<R>): Promise<[R | null, Error | null]> {
  let result: R | null = null;
  let error: Error | null = null;
  let payload: any;
  try {
    let contentHeaders = {};
    if (body && preSend !== undefined) {
      payload = await preSend(body);
    } else {
      payload = body instanceof FormData ? body : JSON.stringify(body);
      contentHeaders =
        body instanceof FormData
          ? contentHeaders
          : {
              "Content-Type": "application/json",
            };
    }
    const token = getCookie("access");
    if (isProtected && !token) {
      throw new Error("Debes tener una cuenta para esta acción");
    }
    let fetchUrl = `${apiUrl}${apiPrefix}${endpoint}`;
    if (!usesPrefix) fetchUrl = `${apiUrl}${endpoint}`;

    const response = await fetch(fetchUrl, {
      method: method,
      ...(body && { body: payload }),
      headers: {
        ...(token && { Authorization: `Bearer ${getCookie("access")}` }),
        ...contentHeaders,
        ...headers,
      },
    });
    const data = await checkError<R>(response, codeMessages, isBlob);
    result = mapper ? mapper(data) : data;
  } catch (err) {
    error = err as Error;
  }
  return [result, error];
}
