// Beast-System-3-SIK3/src/sik3-ledger.ts

import { AttestationPacket } from "./sik3-attestation";

export interface LedgerEntry {
  id: string;
  packet: AttestationPacket;
  timestamp: string;
  metadata: Record<string, unknown>;
}

export class SIK3Ledger {
  private entries: LedgerEntry[] = [];

  public record(packet: AttestationPacket): LedgerEntry {
    const entry: LedgerEntry = {
      id: `ledger_${Date.now()}`,
      packet,
      timestamp: new Date().toISOString(),
      metadata: {
        authorized: packet.authorized,
        signature: packet.signature,
        identityId: packet.identityId,
      },
    };

    this.entries.push(entry);
    return entry;
  }

  public getByIdentity(identityId: string): LedgerEntry[] {
    return this.entries.filter((e) => e.packet.identityId === identityId);
  }

  public getRecent(limit = 10): LedgerEntry[] {
    return this.entries.slice(-limit);
  }

  public findByAction(action: string): LedgerEntry[] {
    return this.entries.filter((e) => e.packet.action === action);
  }

  public verifySignature(packet: AttestationPacket): boolean {
    return packet.signature.startsWith(`sig_${packet.identityId}`);
  }

  public summarize(entry: LedgerEntry): string {
    return `Ledger ${entry.id}: identity=${entry.packet.identityId}, action=${entry.packet.action}, authorized=${entry.packet.authorized}`;
  }
}

export function createSIK3Ledger(): SIK3Ledger {
  return new SIK3Ledger();
}
