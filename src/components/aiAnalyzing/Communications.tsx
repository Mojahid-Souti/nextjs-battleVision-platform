// src/components/aiAnalyzing/Communications.tsx
import { useEffect, useState, useCallback } from 'react';
import { Badge } from "@/components/ui/badge";
import { Attack, ThreatAnalysis } from '@/types/military';
import { attackSimulator } from '@/services/AttackSimulator';
import { analyzeAttackWithAI } from '@/services/openai';
import { Loader2, Shield, Brain, Filter, ActivitySquare, AlertOctagon, AlertTriangle, ChartBar, ListChecks, Network, PlayCircle, Server, ShieldAlert, ShieldCheck, UserX, WifiOff, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '../ui/button';

interface AIInsight {
  pattern_recognition: {
    known_patterns: string[];
    similarity_score: number;
    confidence: number;
  };
  threat_assessment: {
    severity: number;
    urgency: number;
    potential_impact: string[];
  };
  mitigation_strategy: {
    immediate_actions: string[];
    long_term_actions: string[];
    resource_requirements: string[];
  };
  historical_analysis: {
    similar_incidents: number;
    success_rate: number;
    average_resolution_time: number;
  };
}

const Communications = () => {
  const [activeAttacks, setActiveAttacks] = useState<Attack[]>([]);
  const [selectedAttack, setSelectedAttack] = useState<Attack | null>(null);
  const [analysis, setAnalysis] = useState<ThreatAnalysis | null>(null);
  const [, setAIInsight] = useState<AIInsight | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [, setAnalysisHistory] = useState<Map<string, ThreatAnalysis>>(new Map());
  const [, setAiResponseTime] = useState<number>(0);

  const requestAIAnalysis = useCallback(async (attack: Attack) => {
    setIsAnalyzing(true);
    const startTime = Date.now();

    try {
      const aiResponse = await analyzeAttackWithAI(attack);
      const endTime = Date.now();
      setAiResponseTime(endTime - startTime);

      if (aiResponse) {
        // Convert AI response to our ThreatAnalysis format
        const threatAnalysis: ThreatAnalysis = {
          recommendation: aiResponse.analysis,
          confidence: aiResponse.confidence,
          suggestedActions: aiResponse.recommendations,
          estimatedImpact: aiResponse.impact
        };

        // Store in history
        setAnalysisHistory(prev => new Map(prev).set(attack.id, threatAnalysis));
        setAnalysis(threatAnalysis);

        // Parse additional AI insights
        if (aiResponse.pattern_details) {
          setAIInsight({
            pattern_recognition: {
              known_patterns: ['Zero-day exploit', 'Advanced persistent threat', 'Botnet activity'],
              similarity_score: aiResponse.pattern_details.similarity_to_known_attacks,
              confidence: aiResponse.pattern_details.predictability
            },
            threat_assessment: {
              severity: Math.round(attack.intensity * 10),
              urgency: attack.status === 'ongoing' ? 90 : 70,
              potential_impact: [
                'Data breach risk',
                'Service disruption',
                'System compromise'
              ]
            },
            mitigation_strategy: {
              immediate_actions: aiResponse.recommendations.slice(0, 3),
              long_term_actions: [
                'Update security protocols',
                'Enhance monitoring systems',
                'Staff training'
              ],
              resource_requirements: [
                'Additional bandwidth',
                'Security personnel',
                'Updated firewall rules'
              ]
            },
            historical_analysis: {
              similar_incidents: Math.floor(Math.random() * 10) + 1,
              success_rate: 85,
              average_resolution_time: 45
            }
          });
        }
      }
    } catch (error) {
      console.error('AI Analysis failed:', error);
      // Fallback to local analysis
      const fallbackAnalysis = analyzeAttackLocally(attack);
      setAnalysis(fallbackAnalysis);
    } finally {
      setIsAnalyzing(false);
    }
  }, []);


const analyzeAttackLocally = (attack: Attack): ThreatAnalysis => {
    const analysis: ThreatAnalysis = {
      recommendation: '',
      confidence: 0,
      suggestedActions: [],
      estimatedImpact: ''
    };

    switch (attack.type) {
      case 'DDoS':
        analysis.recommendation = 'AI: High-volume distributed denial of service attack detected. Multiple source IPs identified.';
        analysis.confidence = attack.intensity * 10;
        analysis.suggestedActions = [
          'Implement immediate traffic filtering',
          'Scale up network resources',
          'Enable DDoS protection',
          'Analyze traffic patterns for source identification'
        ];
        analysis.estimatedImpact = attack.intensity > 7 ? 
          'Critical - Service availability at risk' : 
          'Moderate - Performance degradation likely';
        break;

      case 'MitM':
        analysis.recommendation = 'AI: Sophisticated man-in-the-middle attack detected. Encryption compromise attempt.';
        analysis.confidence = attack.intensity * 9;
        analysis.suggestedActions = [
          'Enable strict certificate validation',
          'Implement perfect forward secrecy',
          'Monitor for SSL/TLS anomalies',
          'Force re-authentication for critical systems'
        ];
        analysis.estimatedImpact = 'Severe - Data integrity compromised';
        break;

      case 'Spoofing':
        analysis.recommendation = 'AI: Advanced identity spoofing detected with signature manipulation.';
        analysis.confidence = attack.intensity * 8.5;
        analysis.suggestedActions = [
          'Deploy multi-factor authentication',
          'Verify all endpoint identities',
          'Implement IP validation',
          'Enable strict access controls'
        ];
        analysis.estimatedImpact = 'High - Authentication system at risk';
        break;

      case 'Jamming':
        analysis.recommendation = 'AI: Coordinated signal jamming affecting multiple frequencies.';
        analysis.confidence = attack.intensity * 8;
        analysis.suggestedActions = [
          'Activate frequency hopping',
          'Enable backup communication channels',
          'Deploy signal boosters',
          'Initiate counter-jamming measures'
        ];
        analysis.estimatedImpact = 'Critical - Communication blackout possible';
        break;
    }

    return analysis;
  };

  useEffect(() => {
    const updateAttacks = () => {
      setActiveAttacks(attackSimulator.getActiveAttacks());
    };
    

    updateAttacks();
    const interval = setInterval(updateAttacks, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedAttack) {
      requestAIAnalysis(selectedAttack);
    }
  }, [selectedAttack, requestAIAnalysis]);


  return (
    <div className="p-6 space-y-6 bg-gray-50">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Panel - Attack Table */}
        <div className="bg-white border border-gray-100 shadow-sm lg:col-span-7 rounded-xl">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Shield className="w-5 h-5 text-red-500" />
                  <span className="absolute w-2 h-2 bg-red-500 rounded-full -top-1 -right-1 animate-ping" />
                </div>
                <div>
                  <h2 className="font-semibold">Active Attacks</h2>
                  <p className="text-sm text-gray-500">Real-time threat monitoring</p>
                </div>
                <Badge 
                  className="ml-2 text-red-600 border-red-200 bg-red-50 animate-pulse"
                >
                  {activeAttacks.length} Active
                </Badge>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="transition-transform hover:scale-105"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
  
          <div className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-gray-50">
                  <TableHead>Status</TableHead>
                  <TableHead>Threat ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Intensity</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeAttacks.map((attack, idx) => (
                  <TableRow 
                    key={attack.id}
                    className={cn(
                      "cursor-pointer transition-all hover:bg-blue-50/50",
                      "animate-slideIn",
                      {"bg-blue-50/30": selectedAttack?.id === attack.id}
                    )}
                    style={{ animationDelay: `${idx * 100}ms` }}
                    onClick={() => setSelectedAttack(attack)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={cn("w-2 h-2 rounded-full relative", {
                          "bg-green-500": attack.status === "detected",
                          "bg-yellow-500": attack.status === "preparing",
                          "bg-blue-500": attack.status === "mitigated",
                          "bg-red-500": attack.status === "ongoing"
                        })}>
                          <div className="absolute inset-0 bg-current rounded-full opacity-25 animate-ping" />
                        </div>
                        <span className="text-xs font-medium uppercase">{attack.status}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="px-2 py-1 text-sm bg-gray-100 rounded">
                        {attack.id.slice(0, 8)}
                      </code>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {attack.type === 'DDoS' && <Server className="w-4 h-4 text-purple-500" />}
                        {attack.type === 'MitM' && <Network className="w-4 h-4 text-orange-500" />}
                        {attack.type === 'Spoofing' && <UserX className="w-4 h-4 text-yellow-500" />}
                        {attack.type === 'Jamming' && <WifiOff className="w-4 h-4 text-blue-500" />}
                        {attack.type}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="w-24 h-2 overflow-hidden bg-gray-100 rounded-full">
                        <div 
                          className={cn("h-full transition-all", {
                            "bg-red-500": attack.intensity > 7,
                            "bg-yellow-500": attack.intensity > 4 && attack.intensity <= 7,
                            "bg-blue-500": attack.intensity <= 4,
                          })}
                          style={{ width: `${attack.intensity * 10}%` }}
                        />
                      </div>
                    </TableCell>
                    <TableCell>{Math.round(attack.duration / 1000)}s</TableCell>
                    <TableCell>
                      <Badge className={cn("transition-colors", {
                        "bg-red-50 text-red-600 border-red-200": attack.threatLevel === 'critical',
                        "bg-orange-50 text-orange-600 border-orange-200": attack.threatLevel === 'high',
                        "bg-yellow-50 text-yellow-600 border-yellow-200": attack.threatLevel === 'medium',
                        "bg-blue-50 text-blue-600 border-blue-200": attack.threatLevel === 'low'
                      })}>
                        {attack.threatLevel}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="transition-all hover:scale-105 hover:bg-blue-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedAttack(attack);
                        }}
                      >
                        <Zap className="w-4 h-4 mr-1" />
                        Analyze
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
  
        {/* Right Panel - Metrics */}
        <div className="space-y-6 lg:col-span-5">
          {/* Attack Distribution Chart */}
          <div className="p-4 bg-white border border-gray-100 shadow-sm rounded-xl">
            <h3 className="mb-4 font-semibold">Attack Distribution</h3>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart 
                  data={activeAttacks.map(a => ({
                    time: Math.round(a.duration / 1000),
                    intensity: a.intensity
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="time" 
                    stroke="#94a3b8"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    stroke="#94a3b8"
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="intensity" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: '#3b82f6', stroke: 'white', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
  
          {/* Threat Levels */}
          <div className="p-4 bg-white border border-gray-100 shadow-sm rounded-xl">
            <h3 className="mb-4 font-semibold">Threat Levels</h3>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {Object.entries(
                activeAttacks.reduce((acc, attack) => ({
                  ...acc,
                  [attack.threatLevel]: (acc[attack.threatLevel] || 0) + 1
                }), {} as Record<string, number>)
              ).map(([level, count], idx) => (
                <div 
                  key={level}
                  className={cn(
                    "p-4 rounded-lg text-center transition-all hover:scale-105",
                    "animate-slideIn",
                    {
                      "bg-red-50 text-red-600": level === 'critical',
                      "bg-orange-50 text-orange-600": level === 'high',
                      "bg-yellow-50 text-yellow-600": level === 'medium',
                      "bg-blue-50 text-blue-600": level === 'low'
                    }
                  )}
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="mb-1 text-2xl font-bold">{count}</div>
                  <div className="text-xs font-medium uppercase">{level}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* AI Analysis Panel */}
    {selectedAttack && (
    <div 
        className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-xl animate-slideUp"
    >
        <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
            <div className="relative">
                <Brain className="w-5 h-5 text-blue-500" />
                <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-20" />
            </div>
            <div>
                <h2 className="font-semibold">AI Analysis Hub</h2>
                <p className="text-sm text-gray-500">Threat assessment and recommendations</p>
            </div>
            </div>
            {isAnalyzing ? (
            <div className="flex items-center gap-2 text-blue-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Processing...</span>
            </div>
            ) : (
            <Badge className="text-green-600 border-green-200 bg-green-50">
                Analysis Complete
            </Badge>
            )}
        </div>
        </div>

        {analysis ? (
        <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-2">
            {/* Analysis Details */}
            <div className="space-y-6">
            {/* Analysis Overview */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                <ActivitySquare className="w-4 h-4 text-blue-500" />
                <h3 className="font-semibold">Analysis Overview</h3>
                </div>
                <div className="p-4 border border-gray-100 rounded-lg bg-gray-50">
                <p className="leading-relaxed text-gray-600">
                    {analysis.recommendation}
                </p>
                </div>
            </div>

            {/* Confidence Score */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                <ChartBar className="w-4 h-4 text-blue-500" />
                <h3 className="font-semibold">Confidence Score</h3>
                </div>
                <div className="p-4 border border-gray-100 rounded-lg bg-gray-50">
                <div className="flex items-center gap-4 mb-2">
                    <div className="flex-1">
                    <div className="h-2 overflow-hidden bg-gray-200 rounded-full">
                        <div 
                        className="h-full transition-all duration-1000 ease-out bg-blue-500"
                        style={{ width: `${analysis.confidence}%` }}
                        />
                    </div>
                    </div>
                    <span className="font-mono text-sm font-medium">
                    {analysis.confidence}%
                    </span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Low</span>
                    <span>Medium</span>
                    <span>High</span>
                </div>
                </div>
            </div>

            {/* Impact Assessment */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 text-blue-500" />
                <h3 className="font-semibold">Impact Assessment</h3>
                </div>
                <div className="p-4 border border-gray-100 rounded-lg bg-gray-50">
                <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-yellow-100 rounded-full">
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    </div>
                    <p className="flex-1 text-gray-600">
                    {analysis.estimatedImpact}
                    </p>
                </div>
                </div>
            </div>
            </div>

            {/* Recommendations */}
            <div className="space-y-4">
            <div className="flex items-center gap-2">
                <ListChecks className="w-4 h-4 text-blue-500" />
                <h3 className="font-semibold">Recommended Actions</h3>
            </div>
            <div className="space-y-3">
                {analysis.suggestedActions.map((action, index) => (
                <div 
                    key={index}
                    className={cn(
                    "flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100",
                    "transform transition-all hover:scale-[1.02] hover:bg-blue-50",
                    "animate-slideIn cursor-pointer"
                    )}
                    style={{ animationDelay: `${index * 100}ms` }}
                >
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full shrink-0">
                    <div className="w-4 h-4 text-blue-600">
                        {index === 0 && <ShieldAlert />}
                        {index === 1 && <Shield />}
                        {index === 2 && <ShieldCheck />}
                    </div>
                    </div>
                    <div className="flex-1 space-y-1">
                    <h4 className="text-sm font-medium">Action {index + 1}</h4>
                    <p className="text-sm text-gray-600">{action}</p>
                    </div>
                    <Button 
                    variant="ghost" 
                    size="sm"
                    className="shrink-0 hover:bg-blue-100"
                    >
                    <PlayCircle className="w-4 h-4 mr-1" />
                    Execute
                    </Button>
                </div>
                ))}
            </div>

            {/* Action History */}
            <div className="pt-6 mt-6 border-t border-gray-100">
                <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium">Action History</h4>
                <Button variant="outline" size="sm">
                    View All
                </Button>
                </div>
                <div className="space-y-2">
                {[
                    { action: "Firewall rules updated", time: "2m ago" },
                    { action: "Traffic filtering enabled", time: "5m ago" },
                    { action: "Backup systems activated", time: "8m ago" }
                ].map((item, i) => (
                    <div 
                    key={i}
                    className="flex items-center justify-between p-2 text-sm rounded hover:bg-gray-50"
                    >
                    <span className="text-gray-600">{item.action}</span>
                    <span className="text-gray-400">{item.time}</span>
                    </div>
                ))}
                </div>
            </div>
            </div>
        </div>
        ) : (
        <div className="flex flex-col items-center justify-center py-12">
            <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-blue-50">
            <Brain className="w-8 h-8 text-blue-500" />
            </div>
            <p className="text-gray-500">Select an attack to begin analysis</p>
        </div>
        )}
    </div>
    )}
    </div>
  );
};

export default Communications;