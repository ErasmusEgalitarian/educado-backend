interface DataDisplayEmptyStateProps {
  /** Custom empty state component to render instead of the default */
  customEmptyState?: React.ReactNode;
}

/**
 * Default empty state component for DataDisplay.
 * Shows a centered message when no data is available.
 */
const DataDisplayEmptyState = ({
  customEmptyState,
}: DataDisplayEmptyStateProps) => {
  if (customEmptyState !== undefined) {
    return <>{customEmptyState}</>;
  }

  return (
    <div className="flex justify-center items-center py-12">
      <div className="text-center">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Nothing to see here...
        </h3>
        <p className="text-muted-foreground mt-2">
          There is nothing to show here... yet.
        </p>
      </div>
    </div>
  );
};

export default DataDisplayEmptyState;
