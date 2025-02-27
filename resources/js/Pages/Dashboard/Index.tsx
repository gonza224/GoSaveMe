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
import { Button } from '@/components/ui/button';

interface SubmissionItem {
  question: string;
  answer_type: "text" | "file";
  answer_text?: string;
  answer_file?: string; // Could be a JSON encoded array or a string.
  note?: string;
}

interface Submission {
  id: number;
  created_at: string;
  items: SubmissionItem[];
}

interface PaginatedSubmissions {
  data: Submission[];
  current_page: number;
  last_page: number;
  prev_page_url: string | null;
  next_page_url: string | null;
}

interface DashboardPageProps {
  submissions: PaginatedSubmissions;
}

function DashboardPage({ submissions }: DashboardPageProps) {
  // Build an array of page numbers from 1 to last_page.
  const pages = Array.from({ length: submissions.last_page }, (_, i) => i + 1);

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Dashboard</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Submission ID</TableHead>
            <TableHead>Submitted At</TableHead>
            <TableHead>Responses</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {submissions.data.map((submission) => (
            <TableRow key={submission.id}>
              <TableCell className="font-medium">{submission.id}</TableCell>
              <TableCell>
                {new Date(submission.created_at).toLocaleString()}
              </TableCell>
              <TableCell>
                {submission.items.length} response
                {submission.items.length !== 1 ? "s" : ""}
              </TableCell>
              <TableCell className="text-right">
                <Link
                  href={route("submissions", submission.id)}
                  className="text-blue-500 hover:underline"
                >
                  View Details
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination Buttons using shadcn Button component with rounded corners */}
      <div className="mt-4 flex items-center justify-center space-x-2">
        {submissions.prev_page_url ? (
          <Link href={submissions.prev_page_url}>
            <Button variant="outline" size="sm" className="rounded">
              Previous
            </Button>
          </Link>
        ) : (
          <Button variant="outline" size="sm" className="rounded opacity-50 cursor-not-allowed" disabled>
            Previous
          </Button>
        )}

        {pages.map((page) => (
          <Link key={page} href={route("dashboard", { page })}>
            <Button
              variant={page === submissions.current_page ? "default" : "outline"}
              size="sm"
              className="rounded"
            >
              {page}
            </Button>
          </Link>
        ))}

        {submissions.next_page_url ? (
          <Link href={submissions.next_page_url}>
            <Button variant="outline" size="sm" className="rounded">
              Next
            </Button>
          </Link>
        ) : (
          <Button variant="outline" size="sm" className="rounded opacity-50 cursor-not-allowed" disabled>
            Next
          </Button>
        )}
      </div>
    </div >
  );
}

/**
 * Persistent Layout (Inertia.js)
 *
 * [Learn more](https://inertiajs.com/pages#persistent-layouts)
 */
DashboardPage.layout = (page: React.ReactNode) => (
  <MainLayout title="Dashboard" children={page} />
);

export default DashboardPage;
