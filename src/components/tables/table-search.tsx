import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import generateURLParams from "@/lib/generate-url-params";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function TableSearch({ searchKey }: { searchKey: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const searchParams = useSearchParams();
  const page = searchParams.get("page") || "";
  const search = searchParams.get("search") || "";

  const [searchInput, setSearchInput] = useState(search);
  const debouncedSearchValue = useDebounce(searchInput, 300);

  // Update URL with search value
  useEffect(() => {
    const newParams = debouncedSearchValue?.length
      ? { search: debouncedSearchValue, page }
      : { search: null, page: null };

    const urlParams = generateURLParams(searchParams, newParams);

    router.replace(`${pathname}?${urlParams}`);
  }, [debouncedSearchValue, page, pathname, router, searchParams]);

  return (
    <Input
      placeholder={`Search ${searchKey}...`}
      value={searchInput}
      autoFocus
      onChange={(event) => setSearchInput(event.target.value)}
      className="min-w-full max-w-md"
    />
  );
}
