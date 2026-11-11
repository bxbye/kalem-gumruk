import "../config/env.js";
import { ensureDatabaseInitialized, isDbConnected, pool } from "../db/index.js";
import { createDatabaseBackup, listDatabaseBackups, restoreDatabaseBackup, } from "../services/backup.js";
async function main() {
    const [, , command = "create", arg1] = process.argv;
    await ensureDatabaseInitialized();
    if (!isDbConnected) {
        console.error("❌ MySQL veritabanına bağlanılamadı.");
        process.exit(1);
    }
    try {
        if (command === "create") {
            const note = arg1 || "CLI (backup.sh) üzerinden manuel alındı";
            const backup = await createDatabaseBackup("MANUAL", note);
            console.log(`✅ Yedekleme Başarılı: ${backup.filename} (${backup.sizeFormatted})`);
            console.log(`📄 Yol: ${backup.filepath}`);
        }
        else if (command === "list") {
            const list = await listDatabaseBackups();
            console.log(JSON.stringify(list, null, 2));
        }
        else if (command === "restore") {
            if (!arg1) {
                console.error("❌ Geri yüklenecek yedek dosya adı belirtilmelidir.");
                process.exit(1);
            }
            const res = await restoreDatabaseBackup(arg1);
            console.log(`✅ ${res.message}`);
            if (res.preRestoreBackup) {
                console.log(`🛡️ Emniyet yedeği: ${res.preRestoreBackup}`);
            }
        }
        else {
            console.error(`❌ Bilinmeyen komut: ${command}. Kullanım: create | list | restore <dosya>`);
            process.exit(1);
        }
    }
    finally {
        await pool.end().catch(() => { });
    }
}
main().catch((err) => {
    console.error("❌ İşlem hatası:", err?.message || err);
    process.exit(1);
});
