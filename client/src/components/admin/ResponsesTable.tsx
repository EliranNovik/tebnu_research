import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getOptionLabel } from "@/data/questionnaire";
import type { QuestionId, SurveyResponseDoc } from "@/types/survey";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

function chips(values: string[], questionId: QuestionId) {
  return values.map((value) => (
    <Badge key={value} variant="secondary" className="mr-1 mb-1 font-normal">
      {getOptionLabel(questionId, value)}
    </Badge>
  ));
}

type ResponsesTableProps = {
  items: SurveyResponseDoc[];
  page: number;
  total: number;
  limit: number;
};

export function ResponsesTable({ items, page, total, limit }: ResponsesTableProps) {
  const [selected, setSelected] = useState<SurveyResponseDoc | null>(null);
  const [params, setParams] = useSearchParams();
  const pages = Math.max(1, Math.ceil(total / limit));

  function setPage(next: number) {
    const copy = new URLSearchParams(params);
    copy.set("page", String(next));
    setParams(copy);
  }

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-[#ECECF2] bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Response ID</TableHead>
              <TableHead>Submission time</TableHead>
              <TableHead>Categories</TableHead>
              <TableHead>Current method</TableHead>
              <TableHead>Preferred discovery</TableHead>
              <TableHead>Trust factors</TableHead>
              <TableHead>Barriers</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id} className="cursor-pointer" onClick={() => setSelected(item)}>
                <TableCell className="font-mono text-xs">{item.id.slice(0, 8)}</TableCell>
                <TableCell>{new Date(item.metadata.submittedAt).toLocaleString()}</TableCell>
                <TableCell>{chips(item.answers.categories, "categories")}</TableCell>
                <TableCell>{chips(item.answers.current_method, "currentMethod")}</TableCell>
                <TableCell>{chips(item.answers.preferred_discovery, "preferredDiscovery")}</TableCell>
                <TableCell>{chips(item.answers.trust_factors, "trustFactors")}</TableCell>
                <TableCell>{chips(item.answers.barriers, "barriers")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {items.length === 0 ? <p className="p-8 text-center text-sm text-[#6B6280]">No responses match these filters.</p> : null}
      </div>
      <div className="mt-4 flex items-center justify-between text-sm text-[#6B6280]">
        <p>
          Page {page} of {pages} · {total} responses
        </p>
        <div className="flex gap-2">
          <Button variant="outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>
            Previous
          </Button>
          <Button variant="outline" disabled={page >= pages} onClick={() => setPage(page + 1)}>
            Next
          </Button>
        </div>
      </div>
      <Dialog open={Boolean(selected)} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Response {selected?.id.slice(0, 8)}</DialogTitle>
          </DialogHeader>
          {selected ? (
            <div className="space-y-4 text-sm">
              <p className="text-[#6B6280]">{new Date(selected.metadata.submittedAt).toLocaleString()}</p>
              <Detail label="Categories" values={selected.answers.categories} other={selected.answers.categories_other} questionId="categories" />
              <Detail label="Current method" values={selected.answers.current_method} other={selected.answers.current_method_other} questionId="currentMethod" />
              <Detail label="Preferred discovery" values={selected.answers.preferred_discovery} other={selected.answers.preferred_discovery_other} questionId="preferredDiscovery" />
              <Detail label="Trust factors" values={selected.answers.trust_factors} other={selected.answers.trust_factors_other} questionId="trustFactors" />
              <Detail label="Barriers" values={selected.answers.barriers} other={selected.answers.barriers_other} questionId="barriers" />
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}

function Detail({
  label,
  values,
  other,
  questionId,
}: {
  label: string;
  values: string[];
  other?: string;
  questionId: QuestionId;
}) {
  return (
    <div>
      <p className="mb-2 font-semibold">{label}</p>
      <div>{chips(values, questionId)}</div>
      {other ? <p className="mt-2 italic text-[#6B6280]">Other: {other}</p> : null}
    </div>
  );
}
