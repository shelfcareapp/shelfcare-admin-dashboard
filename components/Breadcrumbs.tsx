'use client';

import Link from 'next/link';

interface BreadcrumbsProps {
  paths: { label: string; href?: string }[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ paths }) => {
  return (
    <nav className="text-sm text-gray-600 mb-4" aria-label="Breadcrumb">
      <ol className="list-none p-0 inline-flex">
        {paths.map((path, index) => (
          <li key={index} className="flex items-center">
            {path.href ? (
              <Link href={path.href} className="text-primary hover:underline">
                {path.label}
              </Link>
            ) : (
              <span>{path.label}</span>
            )}
            {index < paths.length - 1 && <span className="mx-2">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
