// src/components/analytics/ThreatTable.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye, MoreHorizontal, Bell, AlertTriangle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ThreatData, ThreatSeverity, ThreatStatus } from '@/types/analytics';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

interface ThreatTableProps {
  threats: ThreatData[];
  notifications: ThreatData[];
  onThreatAction: (threatId: string, action: ThreatStatus) => void;
}

type SeverityConfig = Record<ThreatSeverity, {
  color: string;
  icon: React.FC<{ className?: string }> | null;
  label: string;
}>;

export const ThreatTable: React.FC<ThreatTableProps> = ({ 
  threats,
  notifications,
  onThreatAction
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [highlightedThreat, setHighlightedThreat] = useState<string | null>(null);
  const [selectedThreat, setSelectedThreat] = useState<string | null>(null);
  const itemsPerPage = 5;

  const severityConfig: SeverityConfig = {
    low: { 
      color: 'bg-green-50 text-green-600', 
      icon: null,
      label: 'Low Priority'
    },
    medium: { 
      color: 'bg-yellow-50 text-yellow-600', 
      icon: null,
      label: 'Medium Priority'
    },
    high: { 
      color: 'bg-orange-50 text-orange-600', 
      icon: Bell,
      label: 'High Priority'
    },
    critical: { 
      color: 'bg-red-50 text-red-600', 
      icon: AlertTriangle,
      label: 'Critical Priority'
    }
  };

  const statusColors: Record<ThreatStatus, string> = {
    detected: 'bg-blue-50 text-blue-600',
    analyzing: 'bg-purple-50 text-purple-600',
    mitigated: 'bg-green-50 text-green-600',
    resolved: 'bg-gray-50 text-gray-600'
  };

  useEffect(() => {
    if (notifications.length > 0) {
      const latestThreat = notifications[0];
      setHighlightedThreat(latestThreat.id);
      setTimeout(() => setHighlightedThreat(null), 3000);
    }
  }, [notifications]);

  const handleViewThreat = (threat: ThreatData) => {
    setSelectedThreat(selectedThreat === threat.id ? null : threat.id);
  };

  const SeverityIcon = ({ severity }: { severity: ThreatSeverity }) => {
    const IconComponent = severityConfig[severity].icon;
    return IconComponent ? <IconComponent className="w-3 h-3" /> : null;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Threats</CardTitle>
            <CardDescription>AI-powered threat detection analysis</CardDescription>
          </div>
          <AnimatePresence>
            {notifications.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Badge variant="destructive" className="animate-pulse">
                  {notifications.length} new {notifications.length === 1 ? 'alert' : 'alerts'}
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Time</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="text-center">Detection Score</TableHead>
                <TableHead className="text-center">AI Confidence</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {threats
                .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                .map((threat) => (
                  <React.Fragment key={threat.id}>
                    <motion.tr
                      initial={threat.id === highlightedThreat ? { backgroundColor: 'rgba(59, 130, 246, 0.1)' } : {}}
                      animate={{ backgroundColor: 'transparent' }}
                      transition={{ duration: 2 }}
                      className={`group hover:bg-gray-50 ${
                        selectedThreat === threat.id ? 'bg-blue-50/50' : ''
                      }`}
                    >
                      <TableCell className="font-mono">
                        {format(new Date(threat.timestamp), 'HH:mm:ss')}
                      </TableCell>
                      <TableCell className="font-medium">
                        {threat.type.replace('_', ' ')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full 
                            text-xs font-medium ${severityConfig[threat.severity].color}`}
                          >
                            <SeverityIcon severity={threat.severity} />
                            {threat.severity}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{threat.location}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={threat.detectionScore} className="w-[60px]" />
                          <span className="text-sm">{threat.detectionScore}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={threat.confidence} className="w-[60px]" />
                          <span className="text-sm">{threat.confidence}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full 
                          ${statusColors[threat.status]}`}
                        >
                          {threat.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleViewThreat(threat)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem 
                                onClick={() => onThreatAction(threat.id, 'analyzing')}
                              >
                                Analyze
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => onThreatAction(threat.id, 'mitigated')}
                              >
                                Mitigate
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => onThreatAction(threat.id, 'resolved')}
                              >
                                Resolve
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </motion.tr>
                    {selectedThreat === threat.id && (
                      <motion.tr
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <TableCell colSpan={8} className="p-4 bg-gray-50">
                          <div className="space-y-4">
                            <h4 className="font-medium">Threat Details</h4>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <p className="text-sm text-gray-500">Description</p>
                                <p className="text-sm">{threat.details.description}</p>
                              </div>
                              <div className="space-y-2">
                                <p className="text-sm text-gray-500">Target System</p>
                                <p className="text-sm">{threat.details.targetSystem}</p>
                              </div>
                            </div>
                            {threat.details.recommendations.length > 0 && (
                              <div className="space-y-2">
                                <p className="text-sm text-gray-500">Recommendations</p>
                                <ul className="space-y-1 list-disc list-inside">
                                  {threat.details.recommendations.map((rec, index) => (
                                    <li key={index} className="text-sm">{rec}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </TableCell>
                      </motion.tr>
                    )}
                  </React.Fragment>
                ))}
            </TableBody>
          </Table>
        </div>
        
        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-500">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, threats.length)} of {threats.length} entries
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.ceil(threats.length / itemsPerPage) }).map((_, i) => (
                <Button
                  key={i}
                  variant={currentPage === i + 1 ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(Math.ceil(threats.length / itemsPerPage), p + 1))}
              disabled={currentPage === Math.ceil(threats.length / itemsPerPage)}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ThreatTable;