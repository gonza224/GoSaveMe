import { Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import {
  Table,
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';

interface SubmissionItem {
  question: string;
  answer_type: "text" | "file";
  answer_text?: string;
  answer_file?: string; // May be JSON-encoded array of URLs
  note?: string;
}

interface Submission {
  id: number;
  created_at: string;
  items: SubmissionItem[];
}

interface SubmissionDetailsProps {
  submission: Submission;
}

function SubmissionDetails({ submission }: SubmissionDetailsProps) {
  return (
    <div className="p-8">
      <h1 className="mb-6 text-3xl font-bold">Submission Details</h1>
      <div className="mb-6 space-y-1">
        <p>
          <span className="font-medium">Submission ID:</span> {submission.id}
        </p>
        <p>
          <span className="font-medium">Submitted At:</span>{" "}
          {new Date(submission.created_at).toLocaleString()}
        </p>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Question</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Answer</TableHead>
            <TableHead>Note</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {submission.items.map((item, idx) => (
            <TableRow key={idx}>
              <TableCell>{item.question}</TableCell>
              <TableCell className="capitalize">{item.answer_type}</TableCell>
              <TableCell>
                {item.answer_type === "text" ? (
                  item.answer_text
                ) : (
                  (() => {
                    try {
                      const files: string[] = JSON.parse(item.answer_file || "[]");
                      return (
                        <div className="space-y-1">
                          {files.map((fileUrl, i) => (
                            <a
                              key={i}
                              href={fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline"
                            >
                              File {i + 1}
                            </a>
                          ))}
                        </div>
                      );
                    } catch (error) {
                      return item.answer_file;
                    }
                  })()
                )}
              </TableCell>
              <TableCell>{item.note || "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-6">
        <Link href={route("dashboard")} className="text-blue-500 hover:underline">
          &larr; Back to Dashboard
        </Link>
      </div>
    </div>
  );
}

/**
 * Persistent Layout (Inertia.js)
 *
 * [Learn more](https://inertiajs.com/pages#persistent-layouts)
 */
SubmissionDetails.layout = (page: React.ReactNode) => (
  <MainLayout title="Submission Details" children={page} />
);

export default SubmissionDetails;
