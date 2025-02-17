import Papa from "papaparse";

// src/services/DatasetAnalyzer.ts
export interface UNSWRecord {
    srcip: string;
    sport: number;
    dstip: string;
    dsport: number;
    proto: string;
    state: string;
    dur: number;
    sbytes: number;
    dbytes: number;
    sttl: number;
    dttl: number;
    sloss: number;
    dloss: number;
    service: string;
    Sload: number;
    Dload: number;
    Spkts: number;
    Dpkts: number;
    swin: number;
    dwin: number;
    stcpb: number;
    dtcpb: number;
    smeansz: number;
    dmeansz: number;
    trans_depth: number;
    res_bdy_len: number;
    Sjit: number;
    Djit: number;
    Stime: number;
    Ltime: number;
    Sintpkt: number;
    Dintpkt: number;
    tcprtt: number;
    synack: number;
    ackdat: number;
    is_sm_ips_ports: number;
    ct_state_ttl: number;
    ct_flw_http_mthd: number;
    is_ftp_login: number;
    ct_ftp_cmd: number;
    ct_srv_src: number;
    ct_srv_dst: number;
    ct_dst_ltm: number;
    ct_src_ltm: number;
    ct_src_dport_ltm: number;
    ct_dst_sport_ltm: number;
    ct_dst_src_ltm: number;
    attack_cat: string;
    Label: number;
  }
  
  interface NetworkTrafficAnalysis {
    sourceMetrics: {
      bytes: number;
      packets: number;
      load: number;
      meanSize: number;
      jitter: number;
    };
    destinationMetrics: {
      bytes: number;
      packets: number;
      load: number;
      meanSize: number;
      jitter: number;
    };
    connectionMetrics: {
      duration: number;
      protocol: string;
      state: string;
      service: string;
      tcpMetrics?: {
        rtt: number;
        synack: number;
        ackdat: number;
      };
    };
    flowMetrics: {
      stateTransitions: number;
      httpMethods: number;
      ftpCommands: number;
      sourceServices: number;
      destServices: number;
    };
}

export class DatasetAnalyzer {
    private static instance: DatasetAnalyzer;
    private dataset: UNSWRecord[] = [];
    private attackPatterns: Map<string, UNSWRecord[]> = new Map();

    getAllRecords(): UNSWRecord[] {
        return this.dataset;
      }
    static getInstance(): DatasetAnalyzer {
        if (!this.instance) {
        this.instance = new DatasetAnalyzer();
        }
        return this.instance;
    }

    async loadDataset() {
        try {
        const response = await window.fs.readFile('src/data/UNSW-NB15_1.csv', { encoding: 'utf8' });
        
        return new Promise<void>((resolve) => {
            Papa.parse(response, {
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true,
            complete: (results) => {
                this.dataset = results.data as UNSWRecord[];
                this.processDataset();
                resolve();
            }
            });
        });
        } catch (error) {
        console.error('Error loading dataset:', error);
        throw error;
        }
    }

    private processDataset() {
        // Group records by attack category
        this.dataset.forEach(record => {
        if (record.attack_cat) {
            if (!this.attackPatterns.has(record.attack_cat)) {
            this.attackPatterns.set(record.attack_cat, []);
            }
            this.attackPatterns.get(record.attack_cat)?.push(record);
        }
        });

        // Log some statistics
        console.log('Dataset loaded:', {
        totalRecords: this.dataset.length,
        attackCategories: Array.from(this.attackPatterns.keys()),
        recordsPerCategory: Array.from(this.attackPatterns.entries()).map(([cat, records]) => ({
            category: cat,
            count: records.length
        }))
        });
    }

    matchTrafficPattern(traffic: NetworkTrafficAnalysis): {
        attackType: string;
        confidence: number;
        matchedFeatures: string[];
        details: {
        sourceAnalysis: string;
        destinationAnalysis: string;
        flowAnalysis: string;
        riskLevel: number;
        };
    } {
        const matches = new Map<string, {
        score: number;
        matchedFeatures: string[];
        }>();

        this.attackPatterns.forEach((patterns, attackType) => {
        const analysis = this.analyzePattern(traffic, patterns);
        matches.set(attackType, analysis);
        });

        // Find best match
        let bestMatch = {
        type: '',
        score: 0,
        features: [] as string[],
        details: {
            sourceAnalysis: '',
            destinationAnalysis: '',
            flowAnalysis: '',
            riskLevel: 0
        }
        };

        matches.forEach((result, type) => {
        if (result.score > bestMatch.score) {
            bestMatch = {
            type,
            score: result.score,
            features: result.matchedFeatures,
            details: this.generateAnalysisDetails(traffic, type)
            };
        }
        });

        return {
        attackType: bestMatch.type || 'Unknown',
        confidence: bestMatch.score,
        matchedFeatures: bestMatch.features,
        details: bestMatch.details
        };
    }

    private analyzePattern(traffic: NetworkTrafficAnalysis, patterns: UNSWRecord[]): {
        score: number;
        matchedFeatures: string[];
    } {
        let matchedFeatures: string[] = [];
        let totalScore = 0;

        // Source metrics analysis
        if (this.isWithinRange(traffic.sourceMetrics.load, patterns.map(p => p.Sload))) {
        matchedFeatures.push('source_load');
        totalScore += 10;
        }

        // Packet analysis
        if (this.isWithinRange(traffic.sourceMetrics.packets, patterns.map(p => p.Spkts))) {
        matchedFeatures.push('packet_pattern');
        totalScore += 15;
        }

        // Flow analysis
        if (this.isWithinRange(traffic.flowMetrics.stateTransitions, patterns.map(p => p.ct_state_ttl))) {
        matchedFeatures.push('flow_pattern');
        totalScore += 20;
        }

        // Protocol and service analysis
        const serviceMatch = patterns.some(p => p.service === traffic.connectionMetrics.service);
        if (serviceMatch) {
        matchedFeatures.push('service_match');
        totalScore += 25;
        }

        return {
        score: totalScore / 70 * 100, // Normalize to percentage
        matchedFeatures
        };
    }

    private isWithinRange(value: number, patternValues: number[]): boolean {
        const avg = patternValues.reduce((a, b) => a + b, 0) / patternValues.length;
        const std = Math.sqrt(patternValues.reduce((sq, n) => sq + Math.pow(n - avg, 2), 0) / patternValues.length);
        return Math.abs(value - avg) <= std * 2; // Within 2 standard deviations
    }

    private generateAnalysisDetails(_traffic: NetworkTrafficAnalysis, patternType: string): any {
        // Implement detailed analysis generation
        return {
        sourceAnalysis: `Source traffic pattern matches ${patternType} characteristics`,
        destinationAnalysis: `Destination behavior consistent with ${patternType}`,
        flowAnalysis: `Flow metrics indicate ${patternType} pattern`,
        riskLevel: this.calculateRiskLevel(patternType)
        };
    }

    private calculateRiskLevel(attackType: string): number {
        const riskLevels: Record<string, number> = {
        'DoS': 9,
        'Exploits': 8,
        'Reconnaissance': 6,
        'Generic': 5,
        'Shellcode': 9,
        'Backdoor': 9,
        'Worms': 8,
        'Analysis': 4,
        'Fuzzers': 5
        };

        return riskLevels[attackType] || 5;
    };
};

export const datasetAnalyzer = DatasetAnalyzer.getInstance();