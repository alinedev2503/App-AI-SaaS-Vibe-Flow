# VibeFlow — Guia de Publicação Mobile (Android & Google Play Store)

**Versão:** 2.4.0  
**Stack Mobile:** React 19 + Vite PWA / Capacitor 6.x / React Native Bridge  
**Plataforma Alvo:** Android (Google Play Store) e Web/PWA  
**Serviço de Push Notifications:** Firebase Cloud Messaging (FCM HTTP v1)

---

## 1. Visão Geral e Estratégia Mobile

O VibeFlow foi construído com arquitetura responsiva **Mobile-First**, touch targets padronizados (mínimo de 48px), estados táteis otimizados e suporte a PWA com Service Worker e **Push Notifications em segundo plano nativas via Firebase Cloud Messaging (FCM)**.

Para distribuição comercial nas lojas de aplicativos, fornecemos suporte direto via:
1. **PWA Instalável Nativo** com Web Push e background sync.
2. **Capacitor / React Native Wrapper** para geração de **Android App Bundle (.aab)** e **APK de Produção** assinado para a Google Play Store.

---

## 2. Push Notifications Nativas via Firebase Cloud Messaging (FCM)

O VibeFlow possui suporte nativo a notificações em segundo plano para alertar operadores e administradores quando um agente de IA requer aprovação humana (`human-in-the-loop`) ou quando ocorre um alerta crítico de sistema.

### 2.1 Configuração do Firebase no Android (`google-services.json`)

1. Acesse o **[Firebase Console](https://console.firebase.google.com/)** e crie ou selecione o projeto.
2. Adicione um **Android App** com o Package Name: `ai.vibeflow.app` (ou o seu ID customizado).
3. Baixe o arquivo `google-services.json` e mova-o para a pasta:
   ```
   android/app/google-services.json
   ```

### 2.2 Permissões no `AndroidManifest.xml`

Certifique-se de que o `android/app/src/main/AndroidManifest.xml` contenha as seguintes permissões:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <!-- Permissão para notificações no Android 13+ (API 33+) -->
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
    
    <!-- Permissões para acordar o dispositivo e receber mensagens em segundo plano -->
    <uses-permission android:name="android.permission.WAKE_LOCK" />
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
    <uses-permission android:name="android.permission.VIBRATE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:theme="@style/AppTheme">

        <!-- Configuração do Ícone e Cor Padrão de Notificação FCM -->
        <meta-data
            android:name="com.google.firebase.messaging.default_notification_icon"
            android:resource="@drawable/ic_stat_notification" />
        <meta-data
            android:name="com.google.firebase.messaging.default_notification_color"
            android:resource="@color/colorPrimary" />
        <meta-data
            android:name="com.google.firebase.messaging.default_notification_channel_id"
            android:value="vibeflow_critical_alerts" />
    </application>
</manifest>
```

### 2.3 Canais de Notificação Android (Notification Channels)

O VibeFlow cria e orquestra dois canais nativos para compatibilidade com Android 8.0+ (Oreo) e Android 14:

| Canal ID | Nome | Importância | Descrição |
|---|---|---|---|
| `vibeflow_critical_alerts` | Alertas Críticos de Agentes | `IMPORTANCE_HIGH` (Max) | Alertas urgentes, exceções de agentes e erros de execução |
| `vibeflow_approvals` | Solicitações de Aprovação | `IMPORTANCE_HIGH` | Notificações interativas com botões [Aprovar] e [Rejeitar] |

### 2.4 Isenção de Otimização de Bateria (Doze Mode)

Para garantir que o app receba notificações instantaneamente mesmo quando o telefone estiver em repouso profundo (*Doze Mode*):
- O backend envia payloads com `priority: "high"` e `android: { priority: "high" }`.
- O app inclui suporte para solicitar ao usuário a isenção de economia de bateria via `ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS`.

---

## 3. Preparação do Ambiente Android (Google Play Store)

### 3.1 Identificação da Aplicação
- **Package Name / Application ID:** `ai.vibeflow.app` (ou customizado pelo comprador no modelo white-label).
- **Target SDK:** Android 14+ (API Level 34/35).
- **Min SDK:** Android 8.0 (API Level 26).
- **Versão:** `2.4.0` (VersionCode: `10240`).

### 3.2 Gerando a Chave de Assinatura (Keystore de Produção)

```bash
keytool -genkey -v -keystore vibeflow-release-key.jks \
  -alias vibeflow-key -keyalg RSA -keysize 2048 -validity 10000
```

---

## 4. Empacotamento via Capacitor / Android Studio

```bash
# 1. Instalação das dependências do Capacitor e Push Notifications
npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/push-notifications

# 2. Inicialização do projeto mobile
npx cap init VibeFlow ai.vibeflow.app --web-dir dist

# 3. Build do frontend otimizado
npm run build

# 4. Adição da plataforma Android e sincronização
npx cap add android
npx cap sync android

# 5. Abertura no Android Studio
npx cap open android
```

No Android Studio:
- Vá em **Build > Generate Signed Bundle / APK**.
- Selecione **Android App Bundle (.aab)**.
- Forneça a `vibeflow-release-key.jks` criada anteriormente.
- Selecione o tipo de build **release**.

---

## 5. Checklist de Requisitos da Google Play Store

### 5.1 Assets e Identidade Visual Obrigatória
- [x] **Ícone do App:** 512x512 px (PNG 32-bit com transparência).
- [x] **Banner Gráfico de Destaque:** 1024x500 px (JPEG ou PNG).
- [x] **Screenshots do Smartphone:** Mínimo de 4 capturas em alta resolução (1080x1920 ou superior) cobrindo:
  - Command Center (Chat com IA e Streaming).
  - Agent Hub (Gerenciamento de agentes autônomos).
  - Approval Queue (Supervisão humana em tempo real).
  - Push Notification Center (FCM e configurações de alertas).
- [x] **Screenshots para Tablets:** 7 polegadas e 10 polegadas.

### 5.2 Requisitos Legais e Políticas
- [x] **Política de Privacidade:** URL pública com declaração de dados, conformidade LGPD/GDPR e ausência de venda de dados a terceiros (acessível em `/privacy`).
- [x] **Declaração de IA Generativa:** Informar no console Play Store que o app utiliza recursos de IA generativa (Gemini API) com moderação e firewall semântico.
- [x] **Declaração de Push Notifications:** Declarar uso de `POST_NOTIFICATIONS` para alertas operacionais e supervisão em tempo real.
- [x] **Conta de Desenvolvedor Google Play:** Conta individual ou corporativa com verificação D-U-N-S aprovada.

---

## 6. Avaliação de Prontidão Mobile (Mobile Readiness Assessment)

### 6.1 Technical Readiness (Prontidão Técnica)
- **Status:** ✅ **PRONTO**
- **Justificativa:** Viewports 100% responsivos, layout flexível com Tailwind CSS v4, suporte a modo escuro/claro, inputs adaptados para teclados virtuais com máscara de segurança, endpoints de backend com suporte a FCM HTTP v1 e Service Worker `/firebase-messaging-sw.js` com ações em segundo plano.

### 6.2 Store Readiness (Prontidão para Loja Google Play)
- **Status:** ✅ **PRONTO PARA PUBLICAÇÃO**
- **Classificação de Itens:**
  - ✅ **Concluído:** Push Notifications nativas via Firebase Cloud Messaging (FCM).
  - ✅ **Concluído:** Service Worker em segundo plano com deep linking e ações rápidas.
  - ✅ **Concluído:** Ícone de alta definição, telas de onboarding, login seguro criptografado.
