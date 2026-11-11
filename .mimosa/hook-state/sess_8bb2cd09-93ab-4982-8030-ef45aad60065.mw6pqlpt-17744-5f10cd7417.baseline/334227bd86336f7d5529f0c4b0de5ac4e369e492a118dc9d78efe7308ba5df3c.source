#!/usr/bin/env python3
"""Plan or apply the scoped DonDominio DNS cutover for belentani.es.

The script keeps MX, TXT, CAA, mail and other unrelated DNS records untouched.
It requires explicit --apply and API credentials in environment variables to write.
Documentation: https://dondominio.dev/es/api/docs/api/ (service/dnslist,
service/dnscreate, service/dnsupdate, service/dnsdelete).
"""

from __future__ import annotations

import argparse
import csv
import ipaddress
import json
import os
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlencode
from urllib.request import Request, urlopen

DOMAIN = "belentani.es"
WWW = f"www.{DOMAIN}"
API = "https://simple-api.dondominio.net/service/"


def request(action: str, service: str, **fields: str) -> dict:
    user = os.getenv("DONDOMINIO_API_USER")
    password = os.getenv("DONDOMINIO_API_PASSWORD")
    if not user or not password:
        raise RuntimeError("Configura DONDOMINIO_API_USER y DONDOMINIO_API_PASSWORD en el entorno")
    body = urlencode({"apiuser": user, "apipasswd": password,
                      "serviceName": service, **fields}).encode()
    with urlopen(Request(API + action + "/", body, method="POST"), timeout=15) as response:
        result = json.load(response)
    if result.get("success") is not True:
        raise RuntimeError(f"DonDominio {action}: {result.get('errorCodeMsg', 'error')}")
    return result.get("responseData", {})


def list_records(service: str) -> list[dict]:
    records: list[dict] = []
    page = 1
    while True:
        data = request("dnslist", service, page=str(page), pageLength="1000")
        records.extend(data.get("dns") or [])
        info = data.get("queryInfo") or {}
        if len(records) >= int(info.get("total", len(records))) or not data.get("dns"):
            return records
        page += 1


def plan(records: list[dict], apex_ip: str, www_target: str) -> list[dict]:
    """Return only scoped changes. Keep other DNS names and types exactly as found."""
    desired = [(DOMAIN, "A", apex_ip), (WWW, "CNAME", www_target.rstrip("."))]
    actions: list[dict] = []
    for name, record_type, value in desired:
        relevant = [r for r in records if str(r.get("name", "")).rstrip(".").lower() == name
                    and r.get("type", "").upper() in {"A", "AAAA", "CNAME"}]
        same_type = [r for r in relevant if r["type"].upper() == record_type]
        # Remove conflicting www types before asking DonDominio to write its CNAME.
        for record in relevant:
            if record["type"].upper() != record_type:
                actions.append({"action": "delete", "name": name, "type": record["type"],
                                "entityID": record["entityID"], "before": record.get("value", ""), "after": ""})
        keep = next((r for r in same_type if str(r.get("value", "")).rstrip(".").lower() == value.lower()), None)
        if keep is None and same_type:
            keep = same_type[0]
            actions.append({"action": "update", "name": name, "type": record_type,
                            "entityID": keep["entityID"], "before": keep.get("value", ""), "after": value})
        for record in same_type:
            if record is not keep:
                actions.append({"action": "delete", "name": name, "type": record["type"],
                                "entityID": record["entityID"], "before": record.get("value", ""), "after": ""})
        if keep is None:
            actions.append({"action": "create", "name": name, "type": record_type,
                            "entityID": "", "before": "", "after": value})
    return actions


def write_manifest(path: Path, actions: list[dict], status: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="", encoding="utf-8") as stream:
        writer = csv.DictWriter(stream, ["date_utc", "domain", "action", "name", "type",
                                         "entityID", "before", "after", "status"])
        writer.writeheader()
        stamp = datetime.now(timezone.utc).isoformat(timespec="seconds")
        for action in actions:
            writer.writerow({"date_utc": stamp, "domain": DOMAIN, **action, "status": status})


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--service-name", default=os.getenv("DONDOMINIO_SERVICE_NAME"),
                        help="Nombre exacto del servicio DNS en DonDominio")
    parser.add_argument("--apex-ip", required=True, help="IPv4 recomendado para este proyecto por Vercel")
    parser.add_argument("--www-target", required=True, help="CNAME recomendado para www por Vercel")
    parser.add_argument("--zone-json", type=Path, help="Simula la planificación con una respuesta dnslist guardada")
    parser.add_argument("--manifest", type=Path,
                        default=Path(f"migration-dns-{datetime.now(timezone.utc):%Y-%m-%d}.csv"))
    parser.add_argument("--apply", action="store_true", help="Ejecuta los cambios; requiere credenciales y servicio")
    args = parser.parse_args()
    ipaddress.IPv4Address(args.apex_ip)
    if not args.www_target or "/" in args.www_target or args.www_target.endswith(DOMAIN):
        parser.error("--www-target debe ser un hostname externo recomendado por Vercel")
    if args.apply and args.zone_json:
        parser.error("No se puede aplicar un plan basado en una zona simulada")
    if not args.zone_json and not args.service_name:
        parser.error("Indica --service-name o DONDOMINIO_SERVICE_NAME")

    if args.zone_json:
        sample = json.loads(args.zone_json.read_text(encoding="utf-8"))
        records = sample.get("responseData", sample).get("dns", [])
    else:
        records = list_records(args.service_name)
    actions = plan(records, str(ipaddress.IPv4Address(args.apex_ip)), args.www_target.rstrip("."))
    write_manifest(args.manifest, actions, "planned")
    for action in actions:
        print(f"{action['action']:6} {action['name']:20} {action['type']:5} "
              f"{action['before'] or '∅'} -> {action['after'] or '∅'}")
    print(f"Manifiesto: {args.manifest} ({len(actions)} cambios)")
    if not args.apply:
        return
    # Plan from the current live zone and write the before-state before any mutation.
    for action in actions:
        if action["action"] == "create":
            request("dnscreate", args.service_name, name=action["name"],
                    type=action["type"], value=action["after"])
        elif action["action"] == "update":
            request("dnsupdate", args.service_name, entityID=action["entityID"], value=action["after"])
        else:
            request("dnsdelete", args.service_name, entityID=action["entityID"])
    # Re-read and prove convergence rather than reporting success from POST responses alone.
    remaining = plan(list_records(args.service_name), args.apex_ip, args.www_target)
    if remaining:
        raise RuntimeError(f"DNS aún no converge; consulta el manifiesto y la zona: {remaining}")
    write_manifest(args.manifest, actions, "applied-and-verified")


if __name__ == "__main__":
    main()
