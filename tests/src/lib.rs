#[actix_web::test]

// Why does this exist?
// It will be removed by compiler anyway
// ???
async fn a() {
    assert!(true);
}
