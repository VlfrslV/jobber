{{- define "jobber.databaseUrl" -}}
postgresql://{{ .Values.postgresql.auth.username }}:{{ .Values.postgresql.auth.password }}@postgresql:{{ .Values.postgresql.port }}/{{ .Values.postgresql.auth.database }}
{{- end -}}

{{- define "jobber.env" -}}
- name: PULSAR_SERVICE_URL
  value: pulsar://{{ .Release.Name }}-pulsar-broker.pulsar.svc.cluster.local:6650
- name: DATABASE_URL
  value: {{ include "jobber.databaseUrl" . | quote }}
- name: AUTH_DATABASE_URL
  value: {{ include "jobber.databaseUrl" . | quote }}
{{- end -}}
