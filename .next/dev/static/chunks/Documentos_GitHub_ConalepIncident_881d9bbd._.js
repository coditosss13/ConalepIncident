(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Documentos/GitHub/ConalepIncident/lib/permissions.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PERMISSIONS",
    ()=>PERMISSIONS,
    "ROLES",
    ()=>ROLES,
    "canExportReports",
    ()=>canExportReports,
    "canManageUsers",
    ()=>canManageUsers,
    "canValidateIncidents",
    ()=>canValidateIncidents,
    "canViewAllIncidents",
    ()=>canViewAllIncidents,
    "getUserRole",
    ()=>getUserRole,
    "hasPermission",
    ()=>hasPermission
]);
const ROLES = {
    ADMIN: "Administrador",
    DOCENTE: "Docente",
    COORDINADOR: "Coordinador"
};
const PERMISSIONS = {
    // Gestión de usuarios (solo administrador)
    MANAGE_USERS: [
        ROLES.ADMIN
    ],
    // Configuración de catálogos (solo administrador)
    MANAGE_CATALOGS: [
        ROLES.ADMIN
    ],
    // Configuraciones generales (solo administrador)
    MANAGE_CONFIG: [
        ROLES.ADMIN
    ],
    // Ver bitácora (solo administrador)
    VIEW_BITACORA: [
        ROLES.ADMIN
    ],
    // Registrar incidencias (docentes solo en sus grupos, coordinador y admin en todos)
    CREATE_INCIDENT: [
        ROLES.ADMIN,
        ROLES.DOCENTE,
        ROLES.COORDINADOR
    ],
    // Ver incidencias (todos)
    VIEW_INCIDENTS: [
        ROLES.ADMIN,
        ROLES.DOCENTE,
        ROLES.COORDINADOR
    ],
    // Ver solo incidencias de sus grupos (docentes)
    VIEW_OWN_INCIDENTS: [
        ROLES.DOCENTE
    ],
    // Ver todas las incidencias (coordinador y admin)
    VIEW_ALL_INCIDENTS: [
        ROLES.ADMIN,
        ROLES.COORDINADOR
    ],
    // Validar/Finalizar incidencias (coordinador y admin)
    VALIDATE_INCIDENT: [
        ROLES.ADMIN,
        ROLES.COORDINADOR
    ],
    // Aplicar medidas correctivas (coordinador y admin)
    APPLY_CORRECTIVE_ACTION: [
        ROLES.ADMIN,
        ROLES.COORDINADOR
    ],
    // Generar todos los reportes (coordinador y admin)
    GENERATE_ALL_REPORTS: [
        ROLES.ADMIN,
        ROLES.COORDINADOR
    ],
    // Ver reportes de sus alumnos (docentes)
    VIEW_OWN_REPORTS: [
        ROLES.DOCENTE
    ],
    // Exportar reportes (coordinador y admin)
    EXPORT_REPORTS: [
        ROLES.ADMIN,
        ROLES.COORDINADOR
    ]
};
function hasPermission(userRole, permission) {
    if (!PERMISSIONS[permission]) return false;
    return PERMISSIONS[permission].includes(userRole);
}
function getUserRole(user) {
    // Mapeo de id_rol del backend a nombres de roles
    const roleMap = {
        1: ROLES.ADMIN,
        2: ROLES.DOCENTE,
        3: ROLES.COORDINADOR
    };
    return roleMap[user?.id_rol] || ROLES.DOCENTE;
}
function canManageUsers(userRole) {
    return hasPermission(userRole, "MANAGE_USERS");
}
function canViewAllIncidents(userRole) {
    return hasPermission(userRole, "VIEW_ALL_INCIDENTS");
}
function canValidateIncidents(userRole) {
    return hasPermission(userRole, "VALIDATE_INCIDENT");
}
function canExportReports(userRole) {
    return hasPermission(userRole, "EXPORT_REPORTS");
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documentos/GitHub/ConalepIncident/components/Sidebar.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Sidebar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documentos/GitHub/ConalepIncident/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documentos/GitHub/ConalepIncident/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documentos/GitHub/ConalepIncident/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documentos/GitHub/ConalepIncident/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__ = __turbopack_context__.i("[project]/Documentos/GitHub/ConalepIncident/node_modules/lucide-react/dist/esm/icons/layout-dashboard.js [app-client] (ecmascript) <export default as LayoutDashboard>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/Documentos/GitHub/ConalepIncident/node_modules/lucide-react/dist/esm/icons/settings.js [app-client] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/Documentos/GitHub/ConalepIncident/node_modules/lucide-react/dist/esm/icons/file-text.js [app-client] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PlusCircle$3e$__ = __turbopack_context__.i("[project]/Documentos/GitHub/ConalepIncident/node_modules/lucide-react/dist/esm/icons/circle-plus.js [app-client] (ecmascript) <export default as PlusCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$list$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__List$3e$__ = __turbopack_context__.i("[project]/Documentos/GitHub/ConalepIncident/node_modules/lucide-react/dist/esm/icons/list.js [app-client] (ecmascript) <export default as List>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$chart$2d$column$2d$increasing$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileBarChart$3e$__ = __turbopack_context__.i("[project]/Documentos/GitHub/ConalepIncident/node_modules/lucide-react/dist/esm/icons/file-chart-column-increasing.js [app-client] (ecmascript) <export default as FileBarChart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__ = __turbopack_context__.i("[project]/Documentos/GitHub/ConalepIncident/node_modules/lucide-react/dist/esm/icons/chart-column.js [app-client] (ecmascript) <export default as BarChart3>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/Documentos/GitHub/ConalepIncident/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/Documentos/GitHub/ConalepIncident/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__ = __turbopack_context__.i("[project]/Documentos/GitHub/ConalepIncident/node_modules/lucide-react/dist/esm/icons/shield.js [app-client] (ecmascript) <export default as Shield>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ = __turbopack_context__.i("[project]/Documentos/GitHub/ConalepIncident/node_modules/lucide-react/dist/esm/icons/users.js [app-client] (ecmascript) <export default as Users>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__ = __turbopack_context__.i("[project]/Documentos/GitHub/ConalepIncident/node_modules/lucide-react/dist/esm/icons/log-out.js [app-client] (ecmascript) <export default as LogOut>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documentos/GitHub/ConalepIncident/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$lib$2f$permissions$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documentos/GitHub/ConalepIncident/lib/permissions.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
function Sidebar({ onNavigate }) {
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const [operacionesOpen, setOperacionesOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [userRole, setUserRole] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Sidebar.useEffect": ()=>{
            const userStr = localStorage.getItem("user");
            if (userStr) {
                const user = JSON.parse(userStr);
                setUserRole((0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$lib$2f$permissions$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getUserRole"])(user));
            }
        }
    }["Sidebar.useEffect"], []);
    const isActive = (path)=>pathname === path;
    const handleClick = ()=>{
        if (onNavigate) onNavigate();
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
        className: "w-64 bg-[#0c6857] text-white min-h-screen flex flex-col",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-6 border-b border-white/10",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            src: "/logo.png",
                            alt: "CONALEP Logo",
                            width: 40,
                            height: 40,
                            className: "rounded"
                        }, void 0, false, {
                            fileName: "[project]/Documentos/GitHub/ConalepIncident/components/Sidebar.jsx",
                            lineNumber: 46,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "font-bold text-xl",
                            children: "CONALEP"
                        }, void 0, false, {
                            fileName: "[project]/Documentos/GitHub/ConalepIncident/components/Sidebar.jsx",
                            lineNumber: 47,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Documentos/GitHub/ConalepIncident/components/Sidebar.jsx",
                    lineNumber: 45,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/Documentos/GitHub/ConalepIncident/components/Sidebar.jsx",
                lineNumber: 44,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                className: "flex-1 py-6 overflow-y-auto",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/dashboard",
                        onClick: handleClick,
                        className: `flex items-center gap-3 px-6 py-3 hover:bg-white/10 transition-colors ${isActive("/dashboard") ? "bg-white/20 border-l-4 border-white" : ""}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__["LayoutDashboard"], {
                                className: "h-5 w-5"
                            }, void 0, false, {
                                fileName: "[project]/Documentos/GitHub/ConalepIncident/components/Sidebar.jsx",
                                lineNumber: 59,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Dashboard"
                            }, void 0, false, {
                                fileName: "[project]/Documentos/GitHub/ConalepIncident/components/Sidebar.jsx",
                                lineNumber: 60,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documentos/GitHub/ConalepIncident/components/Sidebar.jsx",
                        lineNumber: 52,
                        columnNumber: 9
                    }, this),
                    userRole === __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$lib$2f$permissions$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ROLES"].ADMIN && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/dashboard/usuarios",
                                onClick: handleClick,
                                className: `flex items-center gap-3 px-6 py-3 hover:bg-white/10 transition-colors ${isActive("/dashboard/usuarios") ? "bg-white/20 border-l-4 border-white" : ""}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"], {
                                        className: "h-5 w-5"
                                    }, void 0, false, {
                                        fileName: "[project]/Documentos/GitHub/ConalepIncident/components/Sidebar.jsx",
                                        lineNumber: 72,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Gestión de Usuarios"
                                    }, void 0, false, {
                                        fileName: "[project]/Documentos/GitHub/ConalepIncident/components/Sidebar.jsx",
                                        lineNumber: 73,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documentos/GitHub/ConalepIncident/components/Sidebar.jsx",
                                lineNumber: 65,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/dashboard/configuracion",
                                onClick: handleClick,
                                className: `flex items-center gap-3 px-6 py-3 hover:bg-white/10 transition-colors ${isActive("/dashboard/configuracion") ? "bg-white/20 border-l-4 border-white" : ""}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"], {
                                        className: "h-5 w-5"
                                    }, void 0, false, {
                                        fileName: "[project]/Documentos/GitHub/ConalepIncident/components/Sidebar.jsx",
                                        lineNumber: 83,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Configuración"
                                    }, void 0, false, {
                                        fileName: "[project]/Documentos/GitHub/ConalepIncident/components/Sidebar.jsx",
                                        lineNumber: 84,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documentos/GitHub/ConalepIncident/components/Sidebar.jsx",
                                lineNumber: 76,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setOperacionesOpen(!operacionesOpen),
                                className: "flex items-center justify-between w-full px-6 py-3 hover:bg-white/10 transition-colors",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                                className: "h-5 w-5"
                                            }, void 0, false, {
                                                fileName: "[project]/Documentos/GitHub/ConalepIncident/components/Sidebar.jsx",
                                                lineNumber: 95,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Operaciones"
                                            }, void 0, false, {
                                                fileName: "[project]/Documentos/GitHub/ConalepIncident/components/Sidebar.jsx",
                                                lineNumber: 96,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documentos/GitHub/ConalepIncident/components/Sidebar.jsx",
                                        lineNumber: 94,
                                        columnNumber: 13
                                    }, this),
                                    operacionesOpen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                        className: "h-4 w-4"
                                    }, void 0, false, {
                                        fileName: "[project]/Documentos/GitHub/ConalepIncident/components/Sidebar.jsx",
                                        lineNumber: 98,
                                        columnNumber: 32
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                        className: "h-4 w-4"
                                    }, void 0, false, {
                                        fileName: "[project]/Documentos/GitHub/ConalepIncident/components/Sidebar.jsx",
                                        lineNumber: 98,
                                        columnNumber: 70
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documentos/GitHub/ConalepIncident/components/Sidebar.jsx",
                                lineNumber: 90,
                                columnNumber: 11
                            }, this),
                            operacionesOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-white/5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: "/dashboard/incidencias/nueva",
                                        onClick: handleClick,
                                        className: `flex items-center gap-3 px-12 py-2.5 hover:bg-white/10 transition-colors ${isActive("/dashboard/incidencias/nueva") ? "bg-white/20 border-l-4 border-white" : ""}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PlusCircle$3e$__["PlusCircle"], {
                                                className: "h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/Documentos/GitHub/ConalepIncident/components/Sidebar.jsx",
                                                lineNumber: 110,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-sm",
                                                children: "Nueva Incidencia"
                                            }, void 0, false, {
                                                fileName: "[project]/Documentos/GitHub/ConalepIncident/components/Sidebar.jsx",
                                                lineNumber: 111,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documentos/GitHub/ConalepIncident/components/Sidebar.jsx",
                                        lineNumber: 103,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: "/dashboard/incidencias",
                                        onClick: handleClick,
                                        className: `flex items-center gap-3 px-12 py-2.5 hover:bg-white/10 transition-colors ${isActive("/dashboard/incidencias") ? "bg-white/20 border-l-4 border-white" : ""}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$list$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__List$3e$__["List"], {
                                                className: "h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/Documentos/GitHub/ConalepIncident/components/Sidebar.jsx",
                                                lineNumber: 121,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-sm",
                                                children: "Incidencias"
                                            }, void 0, false, {
                                                fileName: "[project]/Documentos/GitHub/ConalepIncident/components/Sidebar.jsx",
                                                lineNumber: 122,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documentos/GitHub/ConalepIncident/components/Sidebar.jsx",
                                        lineNumber: 114,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: "/dashboard/reporte-incidencias",
                                        onClick: handleClick,
                                        className: `flex items-center gap-3 px-12 py-2.5 hover:bg-white/10 transition-colors ${isActive("/dashboard/reporte-incidencias") ? "bg-white/20 border-l-4 border-white" : ""}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$chart$2d$column$2d$increasing$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileBarChart$3e$__["FileBarChart"], {
                                                className: "h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/Documentos/GitHub/ConalepIncident/components/Sidebar.jsx",
                                                lineNumber: 132,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-sm",
                                                children: "Reporte Incidencias"
                                            }, void 0, false, {
                                                fileName: "[project]/Documentos/GitHub/ConalepIncident/components/Sidebar.jsx",
                                                lineNumber: 133,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documentos/GitHub/ConalepIncident/components/Sidebar.jsx",
                                        lineNumber: 125,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documentos/GitHub/ConalepIncident/components/Sidebar.jsx",
                                lineNumber: 102,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documentos/GitHub/ConalepIncident/components/Sidebar.jsx",
                        lineNumber: 89,
                        columnNumber: 9
                    }, this),
                    (userRole === __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$lib$2f$permissions$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ROLES"].ADMIN || userRole === __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$lib$2f$permissions$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ROLES"].COORDINADOR) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/dashboard/reportes",
                        onClick: handleClick,
                        className: `flex items-center gap-3 px-6 py-3 hover:bg-white/10 transition-colors ${isActive("/dashboard/reportes") ? "bg-white/20 border-l-4 border-white" : ""}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__["BarChart3"], {
                                className: "h-5 w-5"
                            }, void 0, false, {
                                fileName: "[project]/Documentos/GitHub/ConalepIncident/components/Sidebar.jsx",
                                lineNumber: 147,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Reportes Generales"
                            }, void 0, false, {
                                fileName: "[project]/Documentos/GitHub/ConalepIncident/components/Sidebar.jsx",
                                lineNumber: 148,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documentos/GitHub/ConalepIncident/components/Sidebar.jsx",
                        lineNumber: 140,
                        columnNumber: 11
                    }, this),
                    userRole === __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$lib$2f$permissions$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ROLES"].ADMIN && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/dashboard/bitacora",
                        onClick: handleClick,
                        className: `flex items-center gap-3 px-6 py-3 hover:bg-white/10 transition-colors ${isActive("/dashboard/bitacora") ? "bg-white/20 border-l-4 border-white" : ""}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__["Shield"], {
                                className: "h-5 w-5"
                            }, void 0, false, {
                                fileName: "[project]/Documentos/GitHub/ConalepIncident/components/Sidebar.jsx",
                                lineNumber: 160,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Bitácora"
                            }, void 0, false, {
                                fileName: "[project]/Documentos/GitHub/ConalepIncident/components/Sidebar.jsx",
                                lineNumber: 161,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documentos/GitHub/ConalepIncident/components/Sidebar.jsx",
                        lineNumber: 153,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Documentos/GitHub/ConalepIncident/components/Sidebar.jsx",
                lineNumber: 51,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-4 border-t border-white/10",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: ()=>{
                        localStorage.removeItem("token");
                        localStorage.removeItem("user");
                        window.location.href = "/login";
                    },
                    className: "flex items-center gap-3 px-4 py-3 w-full hover:bg-white/10 transition-colors rounded-lg",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__["LogOut"], {
                            className: "h-5 w-5"
                        }, void 0, false, {
                            fileName: "[project]/Documentos/GitHub/ConalepIncident/components/Sidebar.jsx",
                            lineNumber: 175,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: "Cerrar Sesión"
                        }, void 0, false, {
                            fileName: "[project]/Documentos/GitHub/ConalepIncident/components/Sidebar.jsx",
                            lineNumber: 176,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Documentos/GitHub/ConalepIncident/components/Sidebar.jsx",
                    lineNumber: 167,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/Documentos/GitHub/ConalepIncident/components/Sidebar.jsx",
                lineNumber: 166,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Documentos/GitHub/ConalepIncident/components/Sidebar.jsx",
        lineNumber: 43,
        columnNumber: 5
    }, this);
}
_s(Sidebar, "lAATCIKnEyDW8A5RgZaEsRLoVUE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = Sidebar;
var _c;
__turbopack_context__.k.register(_c, "Sidebar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documentos/GitHub/ConalepIncident/lib/api.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createIncidencia",
    ()=>createIncidencia,
    "getIncidenciaById",
    ()=>getIncidenciaById,
    "getIncidencias",
    ()=>getIncidencias,
    "getToken",
    ()=>getToken,
    "getUserData",
    ()=>getUserData,
    "hasPermission",
    ()=>hasPermission,
    "login",
    ()=>login,
    "registerDocente",
    ()=>registerDocente,
    "removeToken",
    ()=>removeToken,
    "saveToken",
    ()=>saveToken,
    "saveUserData",
    ()=>saveUserData
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/Documentos/GitHub/ConalepIncident/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
const API_URL = __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
async function login(usuario, password) {
    const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            usuario,
            password
        })
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Error en login");
    }
    return res.json();
}
async function registerDocente(data) {
    const res = await fetch(`${API_URL}/api/auth/register-docente`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Error en registro");
    }
    return res.json();
}
async function getIncidencias(token) {
    const res = await fetch(`${API_URL}/api/incidencias`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    if (!res.ok) throw new Error("Error al obtener incidencias");
    const data = await res.json();
    return data.data || [];
}
async function getIncidenciaById(id, token) {
    const res = await fetch(`${API_URL}/api/incidencias/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    if (!res.ok) throw new Error("Error al obtener incidencia");
    const data = await res.json();
    return data.data;
}
async function createIncidencia(formData, token) {
    const res = await fetch(`${API_URL}/api/incidencias`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`
        },
        body: formData
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Error al crear incidencia");
    }
    return res.json();
}
function saveToken(token) {
    if ("TURBOPACK compile-time truthy", 1) {
        localStorage.setItem("token", token);
    }
}
function getToken() {
    if ("TURBOPACK compile-time truthy", 1) {
        return localStorage.getItem("token");
    }
    //TURBOPACK unreachable
    ;
}
function removeToken() {
    if ("TURBOPACK compile-time truthy", 1) {
        localStorage.removeItem("token");
        localStorage.removeItem("userRol");
        localStorage.removeItem("userName");
    }
}
function saveUserData(rol, nombre) {
    if ("TURBOPACK compile-time truthy", 1) {
        localStorage.setItem("userRol", rol.toString());
        localStorage.setItem("userName", nombre);
    }
}
function getUserData() {
    if ("TURBOPACK compile-time truthy", 1) {
        return {
            rol: localStorage.getItem("userRol"),
            nombre: localStorage.getItem("userName")
        };
    }
    //TURBOPACK unreachable
    ;
}
function hasPermission(requiredRole) {
    if ("TURBOPACK compile-time truthy", 1) {
        const userRole = localStorage.getItem("userRol");
        // Administrador General (rol 1) tiene todos los permisos
        if (userRole === "1") return true;
        // Docente (rol 2) puede registrar incidencias
        if (userRole === "2" && requiredRole === "registro") return true;
        // Prefectura/Control Escolar (rol 3) puede validar y generar reportes
        if (userRole === "3" && (requiredRole === "validacion" || requiredRole === "reportes")) return true;
        return false;
    }
    //TURBOPACK unreachable
    ;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documentos/GitHub/ConalepIncident/lib/utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documentos/GitHub/ConalepIncident/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documentos/GitHub/ConalepIncident/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-client] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documentos/GitHub/ConalepIncident/components/ui/button.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>Button,
    "buttonVariants",
    ()=>buttonVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documentos/GitHub/ConalepIncident/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documentos/GitHub/ConalepIncident/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documentos/GitHub/ConalepIncident/node_modules/@radix-ui/react-slot/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documentos/GitHub/ConalepIncident/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documentos/GitHub/ConalepIncident/lib/utils.ts [app-client] (ecmascript)");
;
;
;
;
;
const buttonVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])('inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0', {
    variants: {
        variant: {
            default: 'bg-primary text-primary-foreground hover:bg-primary/90',
            destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
            outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
            secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
            ghost: 'hover:bg-accent hover:text-accent-foreground',
            link: 'text-primary underline-offset-4 hover:underline'
        },
        size: {
            default: 'h-10 px-4 py-2',
            sm: 'h-9 rounded-md px-3',
            lg: 'h-11 rounded-md px-8',
            icon: 'h-10 w-10'
        }
    },
    defaultVariants: {
        variant: 'default',
        size: 'default'
    }
});
const Button = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = ({ className, variant, size, asChild = false, ...props }, ref)=>{
    const Comp = asChild ? __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Slot"] : 'button';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(buttonVariants({
            variant,
            size,
            className
        })),
        ref: ref,
        ...props
    }, void 0, false, {
        fileName: "[project]/Documentos/GitHub/ConalepIncident/components/ui/button.tsx",
        lineNumber: 46,
        columnNumber: 7
    }, ("TURBOPACK compile-time value", void 0));
});
_c1 = Button;
Button.displayName = 'Button';
;
var _c, _c1;
__turbopack_context__.k.register(_c, "Button$React.forwardRef");
__turbopack_context__.k.register(_c1, "Button");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documentos/GitHub/ConalepIncident/app/dashboard/layout.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DashboardLayout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documentos/GitHub/ConalepIncident/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$components$2f$Sidebar$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documentos/GitHub/ConalepIncident/components/Sidebar.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documentos/GitHub/ConalepIncident/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documentos/GitHub/ConalepIncident/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$lib$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documentos/GitHub/ConalepIncident/lib/api.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documentos/GitHub/ConalepIncident/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__ = __turbopack_context__.i("[project]/Documentos/GitHub/ConalepIncident/node_modules/lucide-react/dist/esm/icons/log-out.js [app-client] (ecmascript) <export default as LogOut>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__ = __turbopack_context__.i("[project]/Documentos/GitHub/ConalepIncident/node_modules/lucide-react/dist/esm/icons/menu.js [app-client] (ecmascript) <export default as Menu>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/Documentos/GitHub/ConalepIncident/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ = __turbopack_context__.i("[project]/Documentos/GitHub/ConalepIncident/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-client] (ecmascript) <export default as ArrowLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documentos/GitHub/ConalepIncident/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
function DashboardLayout({ children }) {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const [userData, setUserData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [mobileMenuOpen, setMobileMenuOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DashboardLayout.useEffect": ()=>{
            const token = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$lib$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getToken"])();
            if (!token) {
                router.push("/login");
                return;
            }
            const user = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$lib$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getUserData"])();
            setUserData(user);
        }
    }["DashboardLayout.useEffect"], [
        router
    ]);
    const handleLogout = ()=>{
        router.push("/login");
    };
    const isDashboardHome = pathname === "/dashboard";
    const getPageTitle = ()=>{
        if (pathname === "/dashboard") return "Sistema de Incidencias";
        if (pathname === "/dashboard/incidencias/nueva") return "Nueva Incidencia";
        if (pathname === "/dashboard/incidencias") return "Operaciones / Incidencias";
        if (pathname === "/dashboard/reportes") return "Reportes";
        if (pathname === "/dashboard/alumnos") return "Alumnos";
        if (pathname.includes("/dashboard/alumnos/")) return "Detalle del Alumno";
        if (pathname.includes("/dashboard/incidencias/")) return "Detalle de Incidencia";
        return "Sistema de Incidencias";
    };
    const showBackButton = pathname !== "/dashboard" && !pathname.endsWith("/incidencias");
    if (!userData) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-center min-h-screen",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-lg text-gray-600",
                children: "Cargando..."
            }, void 0, false, {
                fileName: "[project]/Documentos/GitHub/ConalepIncident/app/dashboard/layout.jsx",
                lineNumber: 50,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/Documentos/GitHub/ConalepIncident/app/dashboard/layout.jsx",
            lineNumber: 49,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex min-h-screen bg-gray-50",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$components$2f$Sidebar$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/Documentos/GitHub/ConalepIncident/app/dashboard/layout.jsx",
                    lineNumber: 58,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/Documentos/GitHub/ConalepIncident/app/dashboard/layout.jsx",
                lineNumber: 57,
                columnNumber: 7
            }, this),
            mobileMenuOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 z-50 lg:hidden",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "fixed inset-0 bg-black/50",
                        onClick: ()=>setMobileMenuOpen(false)
                    }, void 0, false, {
                        fileName: "[project]/Documentos/GitHub/ConalepIncident/app/dashboard/layout.jsx",
                        lineNumber: 64,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "fixed left-0 top-0 bottom-0 w-64 bg-white",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$components$2f$Sidebar$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            onNavigate: ()=>setMobileMenuOpen(false)
                        }, void 0, false, {
                            fileName: "[project]/Documentos/GitHub/ConalepIncident/app/dashboard/layout.jsx",
                            lineNumber: 66,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Documentos/GitHub/ConalepIncident/app/dashboard/layout.jsx",
                        lineNumber: 65,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Documentos/GitHub/ConalepIncident/app/dashboard/layout.jsx",
                lineNumber: 63,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 flex flex-col lg:pl-64 w-full",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                        className: "bg-[#0c6857] text-white px-4 lg:px-6 py-4 shadow-md",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                            variant: "ghost",
                                            size: "icon",
                                            onClick: ()=>setMobileMenuOpen(!mobileMenuOpen),
                                            className: "lg:hidden text-white hover:bg-white/10",
                                            children: mobileMenuOpen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                className: "h-6 w-6"
                                            }, void 0, false, {
                                                fileName: "[project]/Documentos/GitHub/ConalepIncident/app/dashboard/layout.jsx",
                                                lineNumber: 81,
                                                columnNumber: 35
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__["Menu"], {
                                                className: "h-6 w-6"
                                            }, void 0, false, {
                                                fileName: "[project]/Documentos/GitHub/ConalepIncident/app/dashboard/layout.jsx",
                                                lineNumber: 81,
                                                columnNumber: 63
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/Documentos/GitHub/ConalepIncident/app/dashboard/layout.jsx",
                                            lineNumber: 75,
                                            columnNumber: 15
                                        }, this),
                                        showBackButton && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            href: "/dashboard/incidencias",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                variant: "ghost",
                                                size: "icon",
                                                className: "text-white hover:bg-white/10",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                                                    className: "h-5 w-5"
                                                }, void 0, false, {
                                                    fileName: "[project]/Documentos/GitHub/ConalepIncident/app/dashboard/layout.jsx",
                                                    lineNumber: 87,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/Documentos/GitHub/ConalepIncident/app/dashboard/layout.jsx",
                                                lineNumber: 86,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/Documentos/GitHub/ConalepIncident/app/dashboard/layout.jsx",
                                            lineNumber: 85,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                                    className: "text-lg lg:text-xl font-bold",
                                                    children: getPageTitle()
                                                }, void 0, false, {
                                                    fileName: "[project]/Documentos/GitHub/ConalepIncident/app/dashboard/layout.jsx",
                                                    lineNumber: 93,
                                                    columnNumber: 17
                                                }, this),
                                                isDashboardHome && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm text-white/90",
                                                    children: [
                                                        "Bienvenido, ",
                                                        userData.nombre,
                                                        " ",
                                                        userData.primerapell || ""
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Documentos/GitHub/ConalepIncident/app/dashboard/layout.jsx",
                                                    lineNumber: 95,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Documentos/GitHub/ConalepIncident/app/dashboard/layout.jsx",
                                            lineNumber: 92,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Documentos/GitHub/ConalepIncident/app/dashboard/layout.jsx",
                                    lineNumber: 74,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "hidden sm:inline text-sm text-white/90",
                                            children: [
                                                userData.nombre,
                                                " ",
                                                userData.primerapell || ""
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Documentos/GitHub/ConalepIncident/app/dashboard/layout.jsx",
                                            lineNumber: 103,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                            variant: "ghost",
                                            size: "sm",
                                            onClick: handleLogout,
                                            className: "text-white hover:bg-white/10 flex items-center gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__["LogOut"], {
                                                    className: "h-4 w-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/Documentos/GitHub/ConalepIncident/app/dashboard/layout.jsx",
                                                    lineNumber: 112,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "hidden sm:inline",
                                                    children: "Cerrar Sesión"
                                                }, void 0, false, {
                                                    fileName: "[project]/Documentos/GitHub/ConalepIncident/app/dashboard/layout.jsx",
                                                    lineNumber: 113,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Documentos/GitHub/ConalepIncident/app/dashboard/layout.jsx",
                                            lineNumber: 106,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Documentos/GitHub/ConalepIncident/app/dashboard/layout.jsx",
                                    lineNumber: 102,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documentos/GitHub/ConalepIncident/app/dashboard/layout.jsx",
                            lineNumber: 73,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Documentos/GitHub/ConalepIncident/app/dashboard/layout.jsx",
                        lineNumber: 72,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                        className: "flex-1 p-4 lg:p-6",
                        children: children
                    }, void 0, false, {
                        fileName: "[project]/Documentos/GitHub/ConalepIncident/app/dashboard/layout.jsx",
                        lineNumber: 119,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Documentos/GitHub/ConalepIncident/app/dashboard/layout.jsx",
                lineNumber: 71,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Documentos/GitHub/ConalepIncident/app/dashboard/layout.jsx",
        lineNumber: 56,
        columnNumber: 5
    }, this);
}
_s(DashboardLayout, "sRXXF50z0YXxHgpYJMQRpPI0d5s=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = DashboardLayout;
var _c;
__turbopack_context__.k.register(_c, "DashboardLayout");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=Documentos_GitHub_ConalepIncident_881d9bbd._.js.map