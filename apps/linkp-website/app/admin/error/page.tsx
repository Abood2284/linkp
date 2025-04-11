// ! This route is only built for development purposes, i.e: our instagram callback URL must redirect somwhere incase there is an error, so we redirect to this page and show the error details.
// ! In production, we will redirect to a loading page instead of this error page.
"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function ErrorContent() {
  const [errorDetails, setErrorDetails] = useState<{
    message: string;
    source: string;
    code?: string;
    timestamp: string;
    fullData?: any;
    stack?: string;
  }>({
    message: "No error message available",
    source: "Unknown",
    timestamp: new Date().toISOString(),
  });

  const [copied, setCopied] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    // Parse error information from URL parameters
    const message = searchParams.get("message") || "Unknown error";
    const source = searchParams.get("source") || "OAuth Callback";
    const code = searchParams.get("code") || undefined;
    const stack = searchParams.get("stack") || undefined;
    const rawData = searchParams.get("data");

    // Try to parse any JSON data that might have been passed
    let parsedData = null;
    if (rawData) {
      try {
        parsedData = JSON.parse(rawData);
      } catch (e) {
        console.warn("Could not parse error data as JSON:", rawData);
      }
    }

    // Additional state from URL if present
    const state = searchParams.get("state");
    const workspaceSlug = searchParams.get("workspace");

    // Combine all available information
    setErrorDetails({
      message,
      source,
      code,
      timestamp: new Date().toISOString(),
      fullData: {
        ...parsedData,
        state,
        workspaceSlug,
        allParams: Object.fromEntries(searchParams.entries()),
      },
      stack,
    });
  }, [searchParams]);

  const copyToClipboard = () => {
    const textToCopy = JSON.stringify(errorDetails, null, 2);
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-indigo-50 p-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="bg-red-50 p-6 border-b border-red-100">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-red-800 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 mr-3 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              Instagram OAuth Error Detective
            </h1>
            <div className="flex space-x-3">
              <button
                onClick={copyToClipboard}
                className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-md transition-colors flex items-center"
              >
                {copied ? (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    Copy Details
                  </>
                )}
              </button>
              <Link
                href="/dashboard"
                className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md transition-colors"
              >
                Return to Dashboard
              </Link>
            </div>
          </div>
          <p className="mt-2 text-red-600">
            Oh no! We encountered an error while connecting your Instagram
            account. Let&apos;s figure out what went wrong.
          </p>
        </div>

        <div className="p-6">
          <div className="mb-8 bg-amber-50 p-4 rounded-lg border border-amber-100">
            <h2 className="text-lg font-semibold text-amber-800 mb-2 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Error Summary
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-amber-700">
                  Error Message:
                </p>
                <p className="text-sm bg-white p-2 rounded border border-amber-200 mt-1">
                  {errorDetails.message}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-amber-700">Source:</p>
                <p className="text-sm bg-white p-2 rounded border border-amber-200 mt-1">
                  {errorDetails.source}
                </p>
              </div>
              {errorDetails.code && (
                <div>
                  <p className="text-sm font-medium text-amber-700">
                    Error Code:
                  </p>
                  <p className="text-sm bg-white p-2 rounded border border-amber-200 mt-1">
                    {errorDetails.code}
                  </p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-amber-700">Timestamp:</p>
                <p className="text-sm bg-white p-2 rounded border border-amber-200 mt-1">
                  {new Date(errorDetails.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-3 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-indigo-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              Troubleshooting Guide
            </h2>
            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
              <h3 className="font-medium text-indigo-800 mb-2">
                Common Instagram OAuth Issues:
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-indigo-600 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>
                    <strong className="text-indigo-800">
                      Missing State Parameter:
                    </strong>{" "}
                    Check if state is being properly generated and passed in the
                    authorization URL.
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-indigo-600 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>
                    <strong className="text-indigo-800">
                      Invalid Redirect URI:
                    </strong>{" "}
                    Ensure the redirect URI matches exactly what&apos;s
                    registered in the Meta Developer Dashboard.
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-indigo-600 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>
                    <strong className="text-indigo-800">
                      Incorrect Permissions:
                    </strong>{" "}
                    Verify the scope parameter contains properly formatted
                    permissions.
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-indigo-600 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>
                    <strong className="text-indigo-800">
                      Token Exchange Failure:
                    </strong>{" "}
                    Check server logs for any issues during the token exchange
                    process.
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-3 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-emerald-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
              </svg>
              Technical Details
            </h2>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">
              <h3 className="font-medium mb-2 text-gray-700">
                Full Error Data:
              </h3>
              <pre className="text-xs text-gray-800 bg-gray-100 p-3 rounded overflow-x-auto whitespace-pre-wrap">
                {JSON.stringify(errorDetails.fullData, null, 2)}
              </pre>

              {errorDetails.stack && (
                <>
                  <h3 className="font-medium mt-4 mb-2 text-gray-700">
                    Stack Trace:
                  </h3>
                  <pre className="text-xs text-gray-800 bg-gray-100 p-3 rounded overflow-x-auto whitespace-pre-wrap">
                    {errorDetails.stack}
                  </pre>
                </>
              )}
            </div>
          </div>

          <div className="mt-8 p-4 bg-green-50 rounded-lg border border-green-100">
            <h2 className="text-lg font-semibold text-green-800 mb-2 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              Next Steps
            </h2>
            <ol className="space-y-2 text-sm text-green-700 ml-7 list-decimal">
              <li>
                Check the server logs for more detailed information about this
                error.
              </li>
              <li>
                Verify your Instagram App configuration in the Meta Developer
                Dashboard.
              </li>
              <li>
                Confirm that your redirect URI is correctly registered and
                formatted.
              </li>
              <li>
                Try the connection process again with any necessary corrections.
              </li>
              <li>
                If issues persist, review the Instagram API documentation for
                updates or changes.
              </li>
            </ol>
            <div className="mt-4 flex justify-center">
              <Link
                href="/dashboard"
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors inline-block"
              >
                Return to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-500">
        This error page is for development purposes only. In production, users
        will be redirected to a loading page.
      </div>
    </div>
  );
}

export default function AdminErrorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-rose-50 to-indigo-50 p-6 flex flex-col items-center justify-center">Loading error details...</div>}>
      <ErrorContent />
    </Suspense>
  );
}
