import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  ChevronDown, 
  Star, 
  Search, 
  Plus, 
  Lock,
  Users,
  FolderOpen,
  Globe,
  Copy,
  Trash2,
  X
} from "lucide-react";
import ReactDOM from "react-dom";

// Generate avatar URL using DiceBear API
const generateAvatarUrl = (seed: string, style: string = 'avataaars') => {
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(seed)}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
};

// Extended mock data with generated avatar URLs
const mockWorkspaces = [
  {
    id: "e81c15a3-af32-4c05-8bb8-d5f27e5ac9d1",
    name: "API Team Development",
    type: "team",
    creator: "John Doe",
    isFavorite: true,
    isActive: false,
    memberCount: 8,
    lastActivity: "viewed 2 hours ago",
    hasNotifications: true,
    description: "Main API development workspace for the product team",
    collectionsCount: 12,
    members: [
      { id: "u1", name: "John Doe", avatar: generateAvatarUrl("john-doe") },
      { id: "u2", name: "Jane Smith", avatar: generateAvatarUrl("jane-smith") },
      { id: "u3", name: "Mike Johnson", avatar: generateAvatarUrl("mike-johnson") },
      { id: "u4", name: "Sarah Wilson", avatar: generateAvatarUrl("sarah-wilson") },
      { id: "u5", name: "Tom Brown", avatar: generateAvatarUrl("tom-brown") },
      { id: "u6", name: "Lisa Davis", avatar: generateAvatarUrl("lisa-davis") },
      { id: "u7", name: "Chris Lee", avatar: generateAvatarUrl("chris-lee") },
      { id: "u8", name: "Amy Chen", avatar: generateAvatarUrl("amy-chen") },
    ]
  },
  {
    id: "f2b8c4d6-1e9a-4f5c-9b7e-3a8d5c2f1b9e", 
    name: "My Workspace",
    type: "personal",
    creator: "You",
    isFavorite: true,
    isActive: true,
    memberCount: 1,
    lastActivity: "current workspace",
    hasNotifications: false,
    description: "Personal workspace for individual projects",
    collectionsCount: 5,
    members: [
      { id: "me", name: "You", avatar: generateAvatarUrl("current-user") },
    ]
  },
  {
    id: "a7d4e8f2-5c3b-4e7a-8f9d-2b5e1c4a7f3d",
    name: "Backend Documentation",
    type: "team", 
    creator: "Sarah Smith",
    isFavorite: true,
    isActive: false,
    memberCount: 4,
    lastActivity: "viewed 1 day ago",
    hasNotifications: false,
    description: "Comprehensive backend API documentation",
    collectionsCount: 8,
    members: [
      { id: "u9", name: "Sarah Smith", avatar: generateAvatarUrl("sarah-smith-2") },
      { id: "u10", name: "David Kim", avatar: generateAvatarUrl("david-kim") },
      { id: "u11", name: "Emma Wilson", avatar: generateAvatarUrl("emma-wilson") },
      { id: "u12", name: "Alex Thompson", avatar: generateAvatarUrl("alex-thompson") },
    ]
  },
  {
    id: "b9f5e2a8-7d1c-4b6e-9a3f-5e8d2c4b7a1e",
    name: "Client Integration Project",
    type: "team",
    creator: "Mike Johnson",
    isFavorite: false,
    isActive: false,
    memberCount: 5,
    lastActivity: "viewed 3 hours ago",
    hasNotifications: true,
    description: "Integration testing with client systems",
    collectionsCount: 15,
    members: [
      { id: "u13", name: "Mike Johnson", avatar: generateAvatarUrl("mike-johnson-2") },
      { id: "u14", name: "Rachel Green", avatar: generateAvatarUrl("rachel-green") },
      { id: "u15", name: "Paul Miller", avatar: generateAvatarUrl("paul-miller") },
      { id: "u16", name: "Anna Davis", avatar: generateAvatarUrl("anna-davis") },
      { id: "u17", name: "Joe Wilson", avatar: generateAvatarUrl("joe-wilson") },
    ]
  },
  {
    id: "c3a6d9e4-2f8b-4c5e-7a9d-1e4b8f2c6a5d",
    name: "GraphQL Best Practices",
    type: "public",
    creator: "Apollo Team",
    teamName: "Platform Core",
    isFavorite: false,
    isActive: false,
    memberCount: 2,
    lastActivity: "1 week ago",
    hasNotifications: false,
    description: "Community-driven GraphQL best practices and examples",
    collectionsCount: 23,
    members: [
      { id: "u18", name: "Apollo Team", avatar: generateAvatarUrl("apollo-team") },
      { id: "u19", name: "GraphQL Community", avatar: generateAvatarUrl("graphql-community") },
    ]
  },
  {
    id: "d8e5b2f7-4a9c-4e1d-8b6f-3c7a9e2d5f8b",
    name: "DevKitchen",
    type: "private",
    creator: "Alex Chen",
    teamName: "Engineering Team",
    isFavorite: false,
    isActive: false,
    memberCount: 2,
    lastActivity: "5 days ago",
    hasNotifications: false,
    description: "Alex's private workspace for experimental features and cooking up new ideas",
    collectionsCount: 3,
    members: [
      { id: "u20", name: "Alex Chen", avatar: generateAvatarUrl("alex-chen") },
      { id: "u21", name: "Maya Patel", avatar: generateAvatarUrl("maya-patel") },
    ]
  },
  {
    id: "f5a8d3e7-9c2b-4f1e-8a6d-3b7e9f2a5c8d",
    name: "Mobile App Testing",
    type: "team",
    creator: "Jessica Park",
    isFavorite: false,
    isActive: false,
    memberCount: 6,
    lastActivity: "viewed 2 days ago",
    hasNotifications: true,
    description: "Mobile application testing and quality assurance",
    collectionsCount: 18,
    members: [
      { id: "u22", name: "Jessica Park", avatar: generateAvatarUrl("jessica-park") },
      { id: "u23", name: "Marcus Lee", avatar: generateAvatarUrl("marcus-lee") },
      { id: "u24", name: "Sofia Rodriguez", avatar: generateAvatarUrl("sofia-rodriguez") },
      { id: "u25", name: "Kevin Chang", avatar: generateAvatarUrl("kevin-chang") },
      { id: "u26", name: "Diana Foster", avatar: generateAvatarUrl("diana-foster") },
      { id: "u27", name: "Ryan Walsh", avatar: generateAvatarUrl("ryan-walsh") },
    ]
  },
  {
    id: "g7b9f4e1-5d8a-4c2f-9e3b-7a1f5e8b4d7g",
    name: "Security Compliance",
    type: "team",
    creator: "Robert Kumar",
    isFavorite: true,
    isActive: false,
    memberCount: 4,
    lastActivity: "viewed 1 hour ago",
    hasNotifications: false,
    description: "Security testing and compliance verification",
    collectionsCount: 25,
    members: [
      { id: "u28", name: "Robert Kumar", avatar: generateAvatarUrl("robert-kumar") },
      { id: "u29", name: "Elena Volkov", avatar: generateAvatarUrl("elena-volkov") },
      { id: "u30", name: "James Mitchell", avatar: generateAvatarUrl("james-mitchell") },
      { id: "u31", name: "Priya Sharma", avatar: generateAvatarUrl("priya-sharma") },
    ]
  },
  {
    id: "h8c1f6e9-4b7d-4e5a-8f2c-6a9e1f4b7c8h",
    name: "Payment Gateway",
    type: "private",
    creator: "Finance Team",
    isFavorite: false,
    isActive: false,
    memberCount: 3,
    lastActivity: "viewed 3 weeks ago",
    hasNotifications: false,
    description: "Payment processing and financial integrations",
    collectionsCount: 14,
    members: [
      { id: "u32", name: "Finance Team", avatar: generateAvatarUrl("finance-team") },
      { id: "u33", name: "Amanda Clark", avatar: generateAvatarUrl("amanda-clark") },
      { id: "u34", name: "David Zhang", avatar: generateAvatarUrl("david-zhang") },
    ]
  },
  {
    id: "i9d2g7f1-6e8c-4f9b-7a5d-8c2f6g9d2f1i",
    name: "Data Analytics Platform",
    type: "public",
    creator: "Analytics Team",
    isFavorite: false,
    isActive: false,
    memberCount: 8,
    lastActivity: "viewed 6 hours ago",
    hasNotifications: true,
    description: "Data processing and analytics APIs",
    collectionsCount: 32,
    members: [
      { id: "u35", name: "Analytics Team", avatar: generateAvatarUrl("analytics-team") },
      { id: "u36", name: "Maria Santos", avatar: generateAvatarUrl("maria-santos") },
      { id: "u37", name: "Chen Wei", avatar: generateAvatarUrl("chen-wei") },
      { id: "u38", name: "Ahmed Hassan", avatar: generateAvatarUrl("ahmed-hassan") },
      { id: "u39", name: "Lisa Thompson", avatar: generateAvatarUrl("lisa-thompson") },
      { id: "u40", name: "Carlos Mendez", avatar: generateAvatarUrl("carlos-mendez") },
      { id: "u41", name: "Yuki Tanaka", avatar: generateAvatarUrl("yuki-tanaka") },
      { id: "u42", name: "Nina Petrov", avatar: generateAvatarUrl("nina-petrov") },
    ]
  },
  {
    id: "j1e3h8g2-7f9d-4a6c-8b4e-9d3g7h1e8g2j",
    name: "Legacy System Migration",
    type: "team",
    creator: "Infrastructure Team",
    isFavorite: false,
    isActive: false,
    memberCount: 5,
    lastActivity: "viewed 4 days ago",
    hasNotifications: false,
    description: "Migrating legacy systems to modern infrastructure",
    collectionsCount: 11,
    members: [
      { id: "u43", name: "Infrastructure Team", avatar: generateAvatarUrl("infrastructure-team") },
      { id: "u44", name: "Michael Brown", avatar: generateAvatarUrl("michael-brown") },
      { id: "u45", name: "Sarah Johnson", avatar: generateAvatarUrl("sarah-johnson") },
      { id: "u46", name: "Antonio Garcia", avatar: generateAvatarUrl("antonio-garcia") },
      { id: "u47", name: "Rachel Cohen", avatar: generateAvatarUrl("rachel-cohen") },
    ]
  },
  {
    id: "k2f4i9h3-8a1e-4b7d-9c5f-1e4h9i2f4h3k",
    name: "Customer Support API",
    type: "team",
    creator: "Support Team",
    isFavorite: false,
    isActive: false,
    memberCount: 4,
    lastActivity: "viewed 1 day ago",
    hasNotifications: false,
    description: "Customer support and ticketing system APIs",
    collectionsCount: 9,
    members: [
      { id: "u48", name: "Support Team", avatar: generateAvatarUrl("support-team") },
      { id: "u49", name: "Lauren Adams", avatar: generateAvatarUrl("lauren-adams") },
      { id: "u50", name: "Mark Wilson", avatar: generateAvatarUrl("mark-wilson") },
      { id: "u51", name: "Jenny Liu", avatar: generateAvatarUrl("jenny-liu") },
    ]
  }
];

// Recent searches mock data
const mockRecentSearches = ["API", "documentation", "client", "graphql"];

type Workspace = typeof mockWorkspaces[0];
type Member = Workspace['members'][0];

// Member face pile component with real avatar images (for tooltips)
const MemberFacePile = ({ members, maxVisible = 3 }: { members: Member[], maxVisible?: number }) => {
  const visibleMembers = members.slice(0, maxVisible);
  const remainingCount = Math.max(0, members.length - maxVisible);

  return (
    <div className="flex -space-x-1">
      {visibleMembers.map((member, index) => (
        <TooltipProvider key={member.id}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Avatar className="h-5 w-5 border-2 border-background">
                <AvatarImage src={member.avatar} alt={member.name} />
                <AvatarFallback className="text-xs bg-muted">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">{member.name}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
      {remainingCount > 0 && (
        <div className="h-5 w-5 rounded-full border-2 border-background bg-muted flex items-center justify-center">
          <span className="text-xs text-muted-foreground">+{remainingCount}</span>
        </div>
      )}
    </div>
  );
};

// Collections count component for main list items
const CollectionsCount = ({ count }: { count: number }) => {
  return (
    <div className="flex items-center text-xs text-muted-foreground">
      <span>{count} collection{count !== 1 ? 's' : ''}</span>
    </div>
  );
};

// Workspace preview tooltip - positioned outside dropdown
const WorkspacePreview = ({ workspace, children }: { workspace: Workspace, children: React.ReactNode }) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent side="right" className="w-80 p-4 z-[70]" sideOffset={423}>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="shrink-0">
                <Avatar className="h-6 w-6 rounded-md">
                  <AvatarFallback className="text-xs bg-muted">
                    {workspace.type === 'personal' ? <Lock size={12} /> : 
                     workspace.type === 'private' ? <Lock size={12} /> :
                     workspace.type === 'team' ? <Users size={12} /> :
                     workspace.type === 'public' ? <Globe size={12} /> : <FolderOpen size={12} />}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm mb-1">{workspace.name}</div>
                <div className="text-xs text-muted-foreground">{workspace.description}</div>
              </div>
            </div>
            
            <div className="text-xs text-muted-foreground">
              Generated by 🤖 Postbot
            </div>
            
            <div className="border-t pt-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                <span>⏰ Last updated {workspace.lastActivity}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Avatar className="h-5 w-5">
                    <AvatarImage src={workspace.members[0]?.avatar} />
                    <AvatarFallback className="text-xs">
                      {workspace.members[0]?.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs">{workspace.members[0]?.name || workspace.creator}</span>
                </div>
              </div>
            </div>
            
            <div className="border-t pt-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Workspace ID: {workspace.id.slice(0, 16)}...</span>
                <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                  <Copy size={10} />
                </Button>
              </div>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// Sortable workspace item
const SortableWorkspaceItem = ({ 
  workspace, 
  onToggleFavorite, 
  onSelect,
  onRemoveFromList,
  isDragging = false
}: { 
  workspace: Workspace;
  onToggleFavorite: (id: string) => void;
  onSelect: (workspace: Workspace) => void;
  onRemoveFromList: (workspace: Workspace) => void;
  isDragging?: boolean;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: sortableIsDragging,
  } = useSortable({id: workspace.id});

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: sortableIsDragging ? 0.5 : 1,
  };

  const getWorkspaceIcon = (type: string) => {
    switch (type) {
      case "personal": return <Lock size={16} />;
      case "private": return <Lock size={16} />;
      case "team": return <Users size={16} />;
      case "public": return <Globe size={16} />;
      default: return <FolderOpen size={16} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "personal": return "workspace-personal";
      case "private": return "workspace-private";
      case "team": return "workspace-team";
      case "public": return "workspace-public";
      default: return "muted";
    }
  };

  const getWorkspaceName = (workspace: Workspace) => {
    return workspace.name;
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleFavorite(workspace.id);
  };

  const handleWorkspaceClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSelect(workspace);
  };

  const handleRemoveFromList = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onRemoveFromList(workspace);
  };

  const canRemoveWorkspace = !workspace.isActive || workspace.isFavorite;



  return (
    <div
      ref={!workspace.isActive ? setNodeRef : null}
      style={style}
      className={`flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer group w-full ${
        sortableIsDragging ? 'shadow-lg' : ''
      } ${workspace.isActive ? 'border' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <WorkspacePreview workspace={workspace}>
        <div 
          className="flex items-center gap-3 flex-1 min-w-0" 
          onClick={handleWorkspaceClick}
          {...(!workspace.isActive ? attributes : {})}
          {...(!workspace.isActive ? listeners : {})}
        >
          <div className="relative shrink-0">
            <Avatar className={`h-8 w-8 rounded-md ${workspace.isActive ? '' : 'bg-muted/60'}`} style={workspace.isActive ? { backgroundColor: 'rgba(2, 101, 210, 0.08)' } : {}}>
              <AvatarFallback className={`text-xs bg-transparent text-${getTypeColor(workspace.type)}`}>
                {getWorkspaceIcon(workspace.type)}
              </AvatarFallback>
            </Avatar>

          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <span className={`font-medium text-sm text-foreground truncate`}>
                {getWorkspaceName(workspace)}
              </span>

            </div>
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">
                {workspace.isActive ? 'current workspace' : 
                 workspace.teamName ? `${workspace.teamName} • viewed ${workspace.lastActivity}` : 
                 workspace.lastActivity}
              </div>
            </div>
          </div>
        </div>
      </WorkspacePreview>
      
      {/* Actions: star for starred, remove and star for non-starred */}
      <div className="flex items-center shrink-0 gap-1">
        {workspace.isFavorite ? (
          /* Star button for starred workspaces */
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 transition-opacity z-10"
            onClick={handleFavoriteClick}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <Star 
              size={16} 
              className="fill-workspace-favorite text-workspace-favorite"
            />
          </Button>
        ) : (
          /* Remove and Star buttons for non-starred workspaces on hover */
          <>
            {canRemoveWorkspace && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`h-8 w-8 p-0 transition-opacity z-10 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                      onClick={handleRemoveFromList}
                      onPointerDown={(e) => e.stopPropagation()}
                    >
                      <X 
                        size={16} 
                        className="text-muted-foreground hover:text-destructive"
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Remove from list</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            <Button
              variant="ghost"
              size="sm"
              className={`h-8 w-8 p-0 transition-opacity z-10 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
              onClick={handleFavoriteClick}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <Star 
                size={16} 
                className="text-muted-foreground hover:text-workspace-favorite"
              />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

// Loading skeleton
const WorkspaceItemSkeleton = () => (
  <div className="flex items-center gap-3 p-2 w-full">
    <Skeleton className="h-8 w-8 rounded-full" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
    <Skeleton className="h-4 w-4" />
  </div>
);

export const WorkspaceSwitcher = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [workspaces, setWorkspaces] = useState(mockWorkspaces);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState(mockRecentSearches);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isCreating, setIsCreating] = useState(false);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [peekPosition, setPeekPosition] = useState<{ left: number; top: number } | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const currentWorkspace = workspaces.find(w => w.isActive);
  
  const { orderedWorkspaces, hasResults, suggestions } = useMemo(() => {
    const current = workspaces.find(w => w.isActive);
    const others = workspaces.filter(w => !w.isActive);
    const starred = others.filter(w => w.isFavorite).sort((a, b) => a.name.localeCompare(b.name));
    const unstarred = others.filter(w => !w.isFavorite).sort((a, b) => a.name.localeCompare(b.name));
    let displayWorkspaces: typeof workspaces = [];
    if (searchQuery) {
      displayWorkspaces = workspaces.filter(workspace => 
        workspace.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        workspace.creator.toLowerCase().includes(searchQuery.toLowerCase())
      );
    } else {
      if (current) {
        displayWorkspaces = [current, ...starred, ...unstarred];
      } else {
        displayWorkspaces = [...starred, ...unstarred];
      }
    }
    const searchSuggestions = searchQuery.length > 0 ? [
      ...recentSearches.filter(search => 
        search.toLowerCase().includes(searchQuery.toLowerCase())
      ),
      ...workspaces
        .filter(w => w.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .map(w => w.name)
        .filter(name => !recentSearches.includes(name))
    ].slice(0, 3) : [];
    return { 
      orderedWorkspaces: displayWorkspaces,
      hasResults: displayWorkspaces.length > 0,
      suggestions: searchSuggestions
    };
  }, [workspaces, searchQuery, recentSearches]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < orderedWorkspaces.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => prev > 0 ? prev - 1 : prev);
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && selectedIndex < orderedWorkspaces.length) {
            handleSelectWorkspace(orderedWorkspaces[selectedIndex]);
          } else if (searchQuery && !hasResults) {
            handleCreateWorkspace(searchQuery);
          }
          break;
        case 'Escape':
          setIsOpen(false);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, orderedWorkspaces, searchQuery, hasResults]);

  // Reset selected index when search changes
  useEffect(() => {
    setSelectedIndex(-1);
  }, [searchQuery]);

  const handleToggleFavorite = (workspaceId: string) => {
    setWorkspaces(prev => prev.map(w => 
      w.id === workspaceId ? { ...w, isFavorite: !w.isFavorite } : w
    ));
  };



  const handleRemoveFromList = (workspace: Workspace) => {
    setWorkspaces(prev => prev.filter(w => w.id !== workspace.id));
  };

  const handleSelectWorkspace = async (workspace: Workspace) => {
    setIsLoading(true);
    
    // Add to recent searches
    if (searchQuery && !recentSearches.includes(searchQuery)) {
      setRecentSearches(prev => [searchQuery, ...prev.slice(0, 4)]);
    }
    
    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setWorkspaces(prev => prev.map(w => ({
      ...w,
      isActive: w.id === workspace.id
    })));
    
    setIsLoading(false);
    setIsOpen(false);
    setSearchQuery("");
  };

  const handleCreateWorkspace = async (name: string) => {
    setIsCreating(true);
    
    // Simulate creation
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newWorkspace: Workspace = {
      id: Date.now().toString(),
      name,
      type: "personal",
      creator: "You",
      isFavorite: false,
      isActive: false,
      memberCount: 1,
      lastActivity: "now",
      hasNotifications: false,
      description: `New workspace: ${name}`,
      collectionsCount: 0,
      members: [{ id: "me", name: "You", avatar: generateAvatarUrl("current-user") }]
    };
    
    setWorkspaces(prev => [newWorkspace, ...prev]);
    setIsCreating(false);
    setIsOpen(false);
    setSearchQuery("");
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setWorkspaces((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over?.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    searchInputRef.current?.focus();
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-64 justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium truncate">
              {currentWorkspace?.name || "Select Workspace"}
            </span>
          </div>
          <ChevronDown size={16} />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="p-0" align="start" style={{ width: '423px', minWidth: '423px', maxWidth: '423px' }}>
        <div ref={dropdownRef} className="p-4 space-y-4" style={{ width: '423px' }}>
          {/* Header with Search and Create button */}
          <div className="flex items-center gap-6" style={{ width: '391px' }}>
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input 
                ref={searchInputRef}
                placeholder="Search workspaces..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm" className="shrink-0 min-w-fit px-3">
              Create Workspace
            </Button>
          </div>

          {/* Search Suggestions */}
          {suggestions.length > 0 && (
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground px-2">Suggestions</div>
              {suggestions.map((suggestion, index) => (
                <Button
                  key={suggestion}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-xs"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <Search size={12} className="mr-2" />
                  {suggestion}
                </Button>
              ))}
              <Separator className="my-2" />
            </div>
          )}

          {/* Workspace List */}
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <WorkspaceItemSkeleton key={i} />
              ))}
            </div>
          ) : hasResults ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={orderedWorkspaces.map(w => w.id)} strategy={verticalListSortingStrategy}>
                <ScrollArea className="h-[360px]" style={{ width: '391px' }}>
                  <div className="space-y-1 pr-4">
                    {orderedWorkspaces.slice(0, 10).map((workspace, index) => (
                      <div
                        key={workspace.id}
                        ref={el => rowRefs.current[index] = el}
                        className={cn(
                          selectedIndex === index && 'bg-muted/50 rounded-lg',
                          workspace.isActive && 'bg-[rgba(2,101,210,0.08)] border border-[rgba(2,101,210,0.2)] rounded-lg'
                        )}
                        onMouseEnter={() => {
                          setHoveredIndex(index);
                          const row = rowRefs.current[index];
                          if (row) {
                              const rowRect = row.getBoundingClientRect();

                              // Position the peek card just to the right of the row,
                              // vertically centered on the row
                              const left = rowRect.right + 24;
                              const top = rowRect.top + rowRect.height / 2;

                              setPeekPosition({
                                left,
                                top,
                              });
                            }
                          }}

                        onMouseLeave={() => {
                          setHoveredIndex(null);
                          setPeekPosition(null);
                        }}
                      >
                        <SortableWorkspaceItem 
                          workspace={workspace}
                          onToggleFavorite={handleToggleFavorite}
                          onSelect={handleSelectWorkspace}
                          onRemoveFromList={handleRemoveFromList}
                        />
                      </div>
                    ))}
                    

                  </div>
                </ScrollArea>
              </SortableContext>
            </DndContext>
          ) : (
            <div className="text-center py-4 text-muted-foreground text-sm" style={{ width: '391px' }}>
              No workspaces found
            </div>
          )}

          {/* View all workspaces link */}
          <Separator />
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer group w-full">
            <div className="flex items-center gap-3 flex-1">
              <span className="font-medium text-sm underline" style={{ color: 'rgb(2, 101, 210)' }}>View all workspaces</span>
            </div>
          </div>
        </div>
      </DropdownMenuContent>
                {hoveredIndex !== null && peekPosition && rowRefs.current[hoveredIndex] &&
            ReactDOM.createPortal(
              <div
                style={{
                  position: 'absolute',
                  left: peekPosition.left,
                  top: peekPosition.top,
                  zIndex: 9999,
                }}
              >
                <WorkspacePreview workspace={orderedWorkspaces[hoveredIndex]}>
                  {/* You can customize the preview content here if needed */}
                </WorkspacePreview>
              </div>,
              document.body
            )
          }
    </DropdownMenu>
  );
};
