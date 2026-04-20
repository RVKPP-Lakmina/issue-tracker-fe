import { title } from "process";

interface PageWrapperProps {
  headerRightContent?: React.ReactNode;
  title?: string;
  description?: string;
  children: React.ReactNode;
}

const PageWrapper: React.FC<PageWrapperProps> = ({
  headerRightContent,
  title,
  description,
  children,
}: PageWrapperProps) => {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card/90 px-6 py-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{title}</h1>
            <p className="text-muted-foreground mt-1">{description}</p>
          </div>
          <div className="flex gap-2">
            <>{headerRightContent}</>
          </div>
        </div>
      </div>

      {children}
    </div>
  );
};

export default PageWrapper;
