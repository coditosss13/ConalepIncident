module.exports = [
"[project]/Documentos/GitHub/ConalepIncident/lib/api.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
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
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
}
function getToken() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return null;
}
function removeToken() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
}
function saveUserData(rol, nombre) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
}
function getUserData() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return {
        rol: null,
        nombre: null
    };
}
function hasPermission(requiredRole) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return false;
}
}),
"[project]/Documentos/GitHub/ConalepIncident/app/page.jsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>HomePage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documentos/GitHub/ConalepIncident/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documentos/GitHub/ConalepIncident/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documentos/GitHub/ConalepIncident/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$lib$2f$api$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documentos/GitHub/ConalepIncident/lib/api.js [app-ssr] (ecmascript)");
"use client";
;
;
;
;
function HomePage() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const token = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$lib$2f$api$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getToken"])();
        if (token) {
            router.push("/dashboard");
        } else {
            router.push("/login");
        }
    }, [
        router
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center justify-center min-h-screen bg-[#0c6857]",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-center",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                    className: "text-2xl font-bold mb-4 text-white",
                    children: "Sistema de Incidencias Escolares"
                }, void 0, false, {
                    fileName: "[project]/Documentos/GitHub/ConalepIncident/app/page.jsx",
                    lineNumber: 22,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$GitHub$2f$ConalepIncident$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-white/80",
                    children: "Cargando..."
                }, void 0, false, {
                    fileName: "[project]/Documentos/GitHub/ConalepIncident/app/page.jsx",
                    lineNumber: 23,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Documentos/GitHub/ConalepIncident/app/page.jsx",
            lineNumber: 21,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/Documentos/GitHub/ConalepIncident/app/page.jsx",
        lineNumber: 20,
        columnNumber: 5
    }, this);
}
}),
"[project]/Documentos/GitHub/ConalepIncident/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/Documentos/GitHub/ConalepIncident/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].ReactJsxDevRuntime; //# sourceMappingURL=react-jsx-dev-runtime.js.map
}),
];

//# sourceMappingURL=Documentos_GitHub_ConalepIncident_10a79044._.js.map