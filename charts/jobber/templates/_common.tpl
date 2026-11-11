{{- define "jobber.authDatabaseUrl" -}}
postgresql://{{ .Values.postgresql.auth.username }}:{{ .Values.postgresql.auth.password }}@postgresql:{{ .Values.postgresql.port }}/{{ .Values.postgresql.auth.databases.auth }}
{{- end -}}

{{- define "jobber.productsDatabaseUrl" -}}
postgresql://{{ .Values.postgresql.auth.username }}:{{ .Values.postgresql.auth.password }}@postgresql:{{ .Values.postgresql.port }}/{{ .Values.postgresql.auth.databases.products }}
{{- end -}}

{{- define "jobber.env" -}}
- name: PULSAR_SERVICE_URL
  value: pulsar://{{ .Release.Name }}-pulsar-broker.pulsar.svc.cluster.local:6650
- name: AUTH_DATABASE_URL
  value: {{ include "jobber.authDatabaseUrl" . | quote }}
- name: PRODUCTS_DATABASE_URL
  value: {{ include "jobber.productsDatabaseUrl" . | quote }}
{{- end -}}
