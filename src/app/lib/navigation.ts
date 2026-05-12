// Maps legacy view names to router paths
const viewToPathMap: Record<string, string> = {
  'dashboard': '/',
  'activity': '/activity',
  'communications': '/communications',
  'clients': '/clients',
  'client-profile': '/clients',
  'objects': '/objects',
  'object-detail': '/objects',
  'requests': '/requests',
  'request-detail': '/requests',
  'shifts': '/shifts',
  'shift-detail': '/shifts',
  'workers': '/workers',
  'worker-profile': '/workers',
  'executor-card': '/workers',
  'payments': '/payments',
  'reports': '/reports',
  'tasks': '/tasks',
  'settings': '/settings',
  'auto-planning': '/auto-planning',
};

export function viewToPath(view: string, id?: string): string {
  const basePath = viewToPathMap[view] || '/';
  if (id && (view.includes('profile') || view.includes('detail') || view.includes('card'))) {
    return `${basePath}/${id}`;
  }
  return basePath;
}

// Maps router paths to sidebar "view" keys for active state
export function pathToView(pathname: string): string {
  if (pathname === '/') return 'dashboard';
  const segment = pathname.split('/')[1];
  return segment || 'dashboard';
}
