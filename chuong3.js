const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  LevelFormat,
} = require("docx");
const fs = require("fs");

// ── helpers ──────────────────────────────────────────────────────────────────
function p(text, opts = {}) {
  return new Paragraph({
    spacing: { before: 120, after: 120, line: 360 },
    alignment: AlignmentType.JUSTIFIED,
    ...opts,
    children: [
      new TextRun({
        text,
        font: "Times New Roman",
        size: 26,
        ...(opts.run || {}),
      }),
    ],
  });
}
function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 280, after: 160 },
    children: [
      new TextRun({ text, font: "Times New Roman", size: 28, bold: true }),
    ],
  });
}
function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 120 },
    children: [
      new TextRun({ text, font: "Times New Roman", size: 26, bold: true }),
    ],
  });
}
function h3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 200, after: 100 },
    children: [
      new TextRun({
        text,
        font: "Times New Roman",
        size: 26,
        bold: true,
        italics: true,
      }),
    ],
  });
}
function note(text) {
  return new Paragraph({
    spacing: { before: 80, after: 80, line: 360 },
    alignment: AlignmentType.CENTER,
    children: [
      new TextRun({ text, font: "Times New Roman", size: 24, italics: true }),
    ],
  });
}
function code(text) {
  return new Paragraph({
    spacing: { before: 60, after: 60, line: 300 },
    indent: { left: 720 },
    children: [new TextRun({ text, font: "Courier New", size: 22 })],
  });
}

// ── content ──────────────────────────────────────────────────────────────────
const children = [
  // ── MỞ CHƯƠNG ─────────────────────────────────────────────────────────────
  h1(
    "CHƯƠNG 3. ÁP DỤNG PHƯƠNG PHÁP HAPSO CHO BÀI TOÁN TÌM ĐƯỜNG ĐI TỐI ƯU CHO UAV TRONG MÔI TRƯỜNG CÓ CHƯỚNG NGẠI VẬT",
  ),

  p(
    "Chương này trình bày toàn bộ quá trình xây dựng và vận hành thuật toán HAPSO cho bài toán hoạch định quỹ đạo UAV. Nội dung được tổ chức theo năm phần: đề xuất và cơ sở thiết kế phương pháp lai, mô hình hóa môi trường, xây dựng hàm mục tiêu và ràng buộc, kiến trúc thuật toán HAPSO, và quy trình tổng thể. Các phân tích trong chương trước về hạn chế của A* và PSO đơn lẻ là tiền đề trực tiếp cho các lựa chọn thiết kế được trình bày dưới đây.",
  ),

  // ── 3.1 ───────────────────────────────────────────────────────────────────
  h2("3.1. Đề xuất phương pháp lai HAPSO"),

  p(
    "Bài toán tìm đường đi cho UAV là bài toán tối ưu hóa đa mục tiêu thuộc lớp NP-hard. Các thuật toán đơn lẻ thường bộc lộ hạn chế: nhóm đồ thị đảm bảo tìm được lời giải nhưng tạo quỹ đạo gấp khúc, trong khi nhóm tối ưu hóa làm mượt quỹ đạo tốt nhưng không đảm bảo tính hoàn thiện. Để khắc phục các hạn chế trên, đề tài đề xuất phương pháp lai HAPSO với cấu trúc đa tầng, chia bài toán thành các giai đoạn xử lý riêng biệt dựa trên A* và PSO.",
  ),

  p(
    "A* đảm nhiệm giai đoạn đầu: khảo sát không gian tìm kiếm và xây dựng quỹ đạo cơ sở đảm bảo an toàn, tối ưu về khoảng cách. PSO tiếp nhận quỹ đạo này và tinh chỉnh từng phân đoạn, làm mềm các khúc cua để đáp ứng ràng buộc phần cứng, đồng thời bảo toàn các đặc tính an toàn mà A* đã thiết lập. Thay vì tìm kiếm ngẫu nhiên trên toàn bộ không gian, PSO chỉ tối ưu cục bộ xung quanh lộ trình cơ sở, giúp giảm chi phí tính toán đáng kể.",
  ),

  p(
    "Sự kết hợp này cho phép HAPSO cân bằng giữa tốc độ xử lý và chất lượng nghiệm, đồng thời có khả năng mở rộng sang các kịch bản không gian tìm kiếm lớn hoặc mật độ vật cản cao mà không làm tăng đáng kể tài nguyên tính toán.",
  ),

  // ── 3.2 ───────────────────────────────────────────────────────────────────
  h2("3.2. Mô hình hóa và phân rã môi trường"),

  note(
    "Hình 16. Bản đồ hoạt động sau khi mô hình hóa và phân rã với kích thước 15×15.",
  ),

  p(
    "Môi trường hoạt động được biểu diễn bằng ma trận hai chiều kích thước H×W, tương ứng với số hàng và số cột của bản đồ lưới. Mỗi phần tử mang một trong bốn giá trị: ô trống (FREE – 0), vật cản (OBSTACLE – 1), điểm xuất phát (START – 2) và điểm đích (GOAL – 3), như minh họa tại Hình 16. Bản đồ được xây dựng theo mô hình 2D tĩnh với vị trí vật cản cố định trong suốt quá trình thực hiện nhiệm vụ.",
  ),

  // ── 3.3 ───────────────────────────────────────────────────────────────────
  h2("3.3. Xây dựng hàm mục tiêu và các ràng buộc tối ưu hóa cho UAV"),

  p(
    "Hàm mục tiêu được xây dựng dựa trên ba tiêu chí: chiều dài quỹ đạo, độ mượt góc quay và hành lang an toàn. Mỗi tiêu chí phản ánh một yêu cầu vận hành cụ thể và được tích hợp trực tiếp vào hàm thích nghi tổng hợp, định hướng quá trình hoạch định quỹ đạo.",
  ),

  h3("3.3.1. Thành phần tối ưu hóa chiều dài quỹ đạo"),

  p(
    "Tối thiểu hóa tổng chiều dài đường bay giúp UAV hoàn thành nhiệm vụ nhanh hơn và tiết kiệm năng lượng – ràng buộc thực tế quan trọng do UAV bị giới hạn về tải trọng và dung lượng pin. Với quỹ đạo P = {p_0, p_1, p_2, …, p_n} và p_i = (x_i, y_i), thành phần chiều dài quỹ đạo f_length(P) được xác định theo công thức:",
  ),

  p(
    "f_length(P) = Σ d(p_i, p_(i+1)) = Σ √[(x_(i+1) − x_i)² + (y_(i+1) − y_i)²]   (3–1)",
    { alignment: AlignmentType.CENTER },
  ),

  h3("3.3.2. Thành phần tối ưu hóa hành lang an toàn"),

  note("Hình 17. Khoảng cách từ phân đoạn quỹ đạo tới vật cản."),

  p(
    "Mỗi phân đoạn quỹ đạo được đánh giá mức độ an toàn qua khoảng cách ngắn nhất đến vật cản gần nhất. Để tính khoảng cách này, hệ thống xác định điểm N(nx, ny) là hình chiếu vuông góc của tâm vật cản O(ox, oy) lên đoạn thẳng SE, như minh họa tại Hình 17. Tọa độ điểm N được xác định thông qua tham số t theo công thức [11]:",
  ),

  p(
    "t = [(ox − sx)·(ex − sx) + (oy − sy)·(ey − sy)] / [(ex − sx)² + (ey − sy)²]   (3–2)",
    { alignment: AlignmentType.CENTER },
  ),

  p(
    "Tham số t được chuẩn hóa về khoảng [0,0; 1,0] để đảm bảo điểm N nằm trong đoạn SE. Tọa độ điểm N được tính như sau [11]:",
  ),

  p("nx = sx + t·(ex − sx)   (3–3)", { alignment: AlignmentType.CENTER }),
  p("ny = sy + t·(ey − sy)   (3–4)", { alignment: AlignmentType.CENTER }),

  p(
    "Khoảng cách an toàn tổng thể min_dist là giá trị nhỏ nhất trong tập hợp khoảng cách từ mỗi phân đoạn đến vật cản gần nhất:",
  ),

  p("min_dist = min(d(O, SE))   (3–5)", { alignment: AlignmentType.CENTER }),

  h3("3.3.3. Thành phần tối ưu hóa độ mượt góc quay"),

  p(
    "UAV có giới hạn về bán kính quay vòng tối thiểu; các góc cua gắt làm giảm hiệu suất và độ ổn định. Góc rẽ θ_i tại điểm p_i được xác định qua hai vectơ v_1 = p_i − p_(i−1) và v_2 = p_(i+1) − p_i theo các công thức sau [11]:",
  ),

  p("dot = v_1 · v_2 = v_1x·v_2x + v_1y·v_2y   (3–6)", {
    alignment: AlignmentType.CENTER,
  }),
  p("cross = v_1 × v_2 = v_1x·v_2y − v_1y·v_2x   (3–7)", {
    alignment: AlignmentType.CENTER,
  }),
  p("θ_i = |atan2(cross, dot) · 180/π|,   θ_i ∈ [0°, 180°]   (3–8)", {
    alignment: AlignmentType.CENTER,
  }),

  p(
    "Từ tập hợp các góc quay của quỹ đạo, góc quay lớn nhất θ_max và góc quay trung bình θ_avg được xác định lần lượt theo:",
  ),

  p("θ_max = max(θ_i)   (3–9)", { alignment: AlignmentType.CENTER }),
  p("θ_avg = 1/(n−1) · Σ θ_i   (3–10)", { alignment: AlignmentType.CENTER }),

  h3("3.3.4. Hàm thích nghi tổng hợp"),

  p(
    "Các thành phần f_length, θ_avg, θ_max và min_dist có đơn vị và khoảng giá trị khác nhau, nên được chuẩn hóa trước khi tổng hợp theo các công thức:",
  ),

  p("f̄_length = f_length / (ref_length + 10⁻⁶)   (3–11)", {
    alignment: AlignmentType.CENTER,
  }),
  p("f̄_avg_angle = θ_avg / (ref_avg_angle + 10⁻⁶)   (3–12)", {
    alignment: AlignmentType.CENTER,
  }),
  p("f̄_max_angle = θ_max / (ref_max_angle + 10⁻⁶)   (3–13)", {
    alignment: AlignmentType.CENTER,
  }),
  p("f̄_min_dist = [1 / (min_dist + 10⁻⁶)] / (ref_min_dist + 10⁻⁶)   (3–14)", {
    alignment: AlignmentType.CENTER,
  }),

  p(
    "Các giá trị tham chiếu ref_length, ref_avg_angle, ref_max_angle và ref_min_dist được thu thập từ kết quả đánh giá quỹ đạo của A* trên cùng bản đồ và cặp điểm xuất phát – đích. Hằng số 10⁻⁶ ngăn chặn lỗi chia cho không. Hàm thích nghi tổng hợp được xác định theo:",
  ),

  p("Total_fitness = collision_penalty,   nếu min_dist < d_danger", {
    alignment: AlignmentType.CENTER,
  }),
  p(
    "Total_fitness = safety_penalty,   nếu d_danger ≤ min_dist < d_min   (3–15)",
    { alignment: AlignmentType.CENTER },
  ),
  p("Total_fitness = f_optimize,   nếu min_dist ≥ d_min", {
    alignment: AlignmentType.CENTER,
  }),

  p(
    "f_optimize = w_1·f̄_length + w_2·f̄_avg_angle + w_3·f̄_max_angle + w_4·f̄_min_dist   (3–16)",
    { alignment: AlignmentType.CENTER },
  ),

  p(
    "Bộ trọng số được xác định qua thử nghiệm: w_1 = 0,3; w_2 = 0,3; w_3 = 0,1; w_4 = 0,3. Ba tiêu chí độ dài, góc quay trung bình và khoảng cách an toàn nhận trọng số cao hơn do tác động trực tiếp đến chất lượng quỹ đạo. Góc quay lớn nhất chỉ phản ánh đặc điểm cục bộ tại một số điểm chuyển hướng nên nhận trọng số thấp hơn.",
  ),

  p(
    "Cơ chế xử lý ràng buộc an toàn hoạt động theo hai ngưỡng: khi min_dist < d_danger, quỹ đạo bị loại bằng collision_penalty; khi d_danger ≤ min_dist < d_min, lộ trình nhận safety_penalty để hướng quần thể tìm kiếm sang các vùng an toàn hơn; khi min_dist ≥ d_min, đường đi được xác định an toàn và đánh giá bằng f_optimize.",
  ),

  p(
    "Tóm lại, hàm thích nghi tổng hợp kết hợp ba tiêu chí bằng trọng số chuẩn hóa, đồng thời áp dụng cơ chế phạt hai ngưỡng để loại bỏ các quỹ đạo vi phạm an toàn ngay trong quá trình tìm kiếm.",
  ),

  // ── 3.4 ───────────────────────────────────────────────────────────────────
  h2("3.4. Lập kế hoạch đường đi tối ưu cho UAV bằng HAPSO"),

  p(
    "Mục này trình bày chi tiết kiến trúc và các cơ chế kỹ thuật của HAPSO, bao gồm cấu trúc phân tầng tổng thể, chiến lược khởi tạo quần thể, cơ chế cập nhật thích nghi, phương pháp làm mượt quỹ đạo và quy trình tổng thể của thuật toán.",
  ),

  h3("3.4.1. Kiến trúc tổng thể và nguyên lý hoạt động của HAPSO"),

  p(
    "HAPSO được thiết kế với cấu trúc xử lý phân tầng gồm hai giai đoạn chính: thiết lập đường bay cơ sở bằng A* và tinh chỉnh quỹ đạo bằng PSO. Sự kết hợp này tận dụng thế mạnh tìm đường của thuật toán đồ thị và khả năng tối ưu hóa liên tục của thuật toán bầy đàn.",
  ),

  p(
    "Trước khi lập quỹ đạo, hệ thống kiểm tra tính hợp lệ của điểm xuất phát và điểm đích. Nếu một trong hai không hợp lệ, hệ thống dừng để tránh lãng phí tài nguyên tính toán. Khi cả hai điểm hợp lệ, A* xây dựng quỹ đạo cơ sở, cung cấp cái nhìn tổng thể về không gian tìm kiếm và giảm nguy cơ PSO rơi vào cực trị cục bộ.",
  ),

  p(
    "PSO tiếp nhận quỹ đạo thô và tối ưu hóa theo từng phân đoạn. Tại mỗi chuỗi ba điểm nút liên tiếp, PSO tìm vị trí tốt nhất nhằm rút ngắn khoảng cách, tăng an toàn và giảm góc cua gắt. Sau đó, phương pháp làm mượt bằng đường cong Bezier được áp dụng để bo tròn các phân đoạn gấp khúc còn lại.",
  ),

  note("Hình 18. Lưu đồ thuật toán HAPSO."),

  p(
    "Các tham số cấu hình được chia thành ba nhóm độc lập: ràng buộc không gian và an toàn, tham số bầy đàn PSO, và tham số điều tiết bước làm mượt.",
  ),

  h3("3.4.2. Chiến lược khởi tạo quần thể theo phân đoạn hình học"),

  p(
    "Thay vì khởi tạo ngẫu nhiên trên toàn bản đồ, HAPSO khởi tạo các cá thể dọc theo từng phân đoạn của quỹ đạo A*, giới hạn không gian tìm kiếm trong hành lang hình học nối liền hai điểm nút liên tiếp. Cách này tránh phát sinh vị trí khởi tạo vô nghĩa và tăng hiệu quả hội tụ.",
  ),

  p(
    "Quy trình bắt đầu bằng cách duyệt tuần tự từng cặp điểm nút trên quỹ đạo từ P_i(x_i, y_i) đến P_(i+1)(x_(i+1), y_(i+1)). Không gian tìm kiếm của quần thể được giới hạn trong hành lang hình học nối liền hai điểm này. Vị trí ban đầu của cá thể m trong phân đoạn P_i → P_(i+1) được xác định theo:",
  ),

  p("x_m = x_i + t·(x_(i+1) − x_i)   (3–17)", {
    alignment: AlignmentType.CENTER,
  }),
  p("y_m = y_i + t·(y_(i+1) − y_i)   (3–18)", {
    alignment: AlignmentType.CENTER,
  }),

  p(
    "trong đó t là giá trị ngẫu nhiên thuộc đoạn [0; 1] [1]. Vận tốc ban đầu được chọn ngẫu nhiên trong [−V_max, V_max], với V_max được tính theo:",
  ),

  p("V_max = k_vmax · √[(x_(i+1) − x_i)² + (y_(i+1) − y_i)²]   (3–19)", {
    alignment: AlignmentType.CENTER,
  }),

  p(
    "Hệ số k_vmax = 0,1 giới hạn vận tốc ban đầu không vượt quá 10% chiều dài phân đoạn, ngăn các cá thể dịch chuyển quá xa khỏi hành lang đã xác định [1], [6].",
  ),

  p(
    "Mỗi cá thể khởi tạo được kiểm tra ba điều kiện: vị trí hợp lệ, không va chạm và đủ khoảng cách an toàn. Nếu tất cả vị trí thử đều không hợp lệ sau số lần thử tối đa, thuật toán gán trung điểm phân đoạn từ quỹ đạo A*, đảm bảo luôn có vị trí hợp lệ để tiếp tục tối ưu hóa.",
  ),

  h3("3.4.3. Cơ chế cập nhật quần thể thích nghi"),

  p(
    "Thay vì trọng số quán tính cố định và hệ số học tập không đổi như PSO chuẩn, HAPSO áp dụng đồng thời ba cơ chế cải tiến: trọng số quán tính ngẫu nhiên (SIW), hệ số học tập thích nghi theo thời gian (TVAC) và chiến lược học đối lập (SOBL).",
  ),

  p(
    "SIW duy trì tính đa dạng quần thể qua dao động ngẫu nhiên của trọng số quán tính. TVAC điều chỉnh ngược chiều các hệ số học tập theo tiến trình tìm kiếm, ưu tiên khám phá ở giai đoạn đầu và hội tụ ở giai đoạn cuối. SOBL khám phá các vị trí đối xứng để mở rộng không gian tìm kiếm, giảm phụ thuộc vào khởi tạo ngẫu nhiên. Ba cơ chế kết hợp tạo sự cân bằng giữa khám phá toàn cục và khai thác cục bộ, giúp quần thể tránh bẫy cực trị.",
  ),

  h3("3.4.4. Phương pháp làm mượt quỹ đạo"),

  p(
    "Quỹ đạo sau tối ưu hóa được làm mượt bằng đường cong Bezier theo ba bước tuần tự: duyệt tìm các góc cua vượt ngưỡng cho phép; xác định hai điểm đầu vào và đầu ra của đoạn cua theo tỷ lệ cấu hình; thay thế đoạn gấp khúc bằng đoạn cong Bezier. Mỗi điểm trên đoạn cong đều được kiểm tra khoảng cách an toàn; nếu không đạt ngưỡng, đoạn gốc được giữ nguyên. Kết quả là quỹ đạo liên tục, đủ mượt để thiết bị duy trì vận tốc ổn định trong suốt hành trình.",
  ),

  h3("3.4.5. Quy trình tổng thể"),

  p(
    "Tiến trình thực thi của HAPSO được trình bày dưới dạng mã giả gồm bốn bước tuần tự: tiếp nhận thông tin môi trường, xây dựng lộ trình cơ sở bằng A*, tối ưu hóa từng phân đoạn bằng PSO và làm mượt quỹ đạo bằng Bezier.",
  ),

  p("Bảng 1. Mã giả của thuật toán HAPSO.", {
    alignment: AlignmentType.CENTER,
    run: { bold: true },
  }),

  code("1.  BẮT ĐẦU"),
  code("2.  "),
  code("3.  // Giai đoạn 1: Kiểm tra tính hợp lệ của biên"),
  code("4.  IF (Start hoặc Goal vi phạm vật cản/biên bản đồ) THEN:"),
  code("5.    RETURN None"),
  code("6.  ENDIF"),
  code("7.  "),
  code("8.  // Giai đoạn 2: Hoạch định hành lang hình học toàn cục (A*)"),
  code("9.  P_initial ← EXECUTE_ASTAR(Start, Goal, GridMap)"),
  code("10. IF (P_initial rỗng) THEN RETURN None"),
  code("11. "),
  code("12. // Giai đoạn 3: Tối ưu hóa bầy đàn thích nghi phân đoạn (PSO)"),
  code("13. P_pso ← [P_initial[0]]"),
  code("14. FOR i FROM 1 TO (Length(P_initial) – 2) DO:"),
  code("15.   Prev ← P_pso[last]"),
  code("16.   Next ← P_initial[i + 1]"),
  code("17. "),
  code("18.   // Khởi tạo quần thể khu trú"),
  code("19.   Particles ← INITIALIZE_PARTICLES(Prev, Next, Omega)"),
  code("20. "),
  code("21.   FOR iteration FROM 1 TO Max_Iter DO:"),
  code("22.     w  ← CALCULATE_SIW(iteration)"),
  code("23.     c1, c2 ← CALCULATE_TVAC(iteration)"),
  code("24. "),
  code("25.     FOR EACH particle IN Particles DO:"),
  code("26.       UPDATE_VELOCITY(particle, w, c1, c2, G_best)"),
  code("27.       UPDATE_POSITION(particle)"),
  code("28. "),
  code("29.       // Chiến lược học tập đối lập ngẫu nhiên"),
  code("30.       Opp_Pos ← CALCULATE_SOBL(particle.pos)"),
  code("31.       IF (Fitness(Opp_Pos) < Fitness(particle.pos)) THEN:"),
  code("32.         particle.pos ← Opp_Pos"),
  code("33.       ENDIF"),
  code("34. "),
  code("35.       UPDATE_PERSONAL_BEST(particle)"),
  code("36.     ENDFOR"),
  code("37.     UPDATE_GLOBAL_BEST(G_best)"),
  code("38.   ENDFOR"),
  code("39. "),
  code("40.   P_pso.APPEND(G_best.pos)"),
  code("41. ENDFOR"),
  code("42. P_pso.APPEND(Goal)"),
  code("43. "),
  code("44. // Giai đoạn 4: Xử lý làm mượt quỹ đạo"),
  code("45. P_final ← BEZIER_SMOOTH(P_pso, GridMap)"),
  code("46. RETURN P_final"),
  code("47. "),
  code("48. KẾT THÚC"),

  p(
    "Quy trình này cho phép PSO kế thừa trực tiếp đường đi thô của A* làm cơ sở khởi tạo, tiết kiệm thời gian và tài nguyên tính toán. Quỹ đạo đầu ra được tối ưu đồng thời về khoảng cách, độ mượt và an toàn, đáp ứng các ràng buộc vận hành của thiết bị.",
  ),

  // ── KẾT LUẬN CHƯƠNG 3 ─────────────────────────────────────────────────────
  h2("Kết luận chương 3"),

  p(
    "Chương này đã trình bày đầy đủ cơ sở thiết kế và cơ chế hoạt động của thuật toán HAPSO. Phần đầu đề xuất kiến trúc lai hai tầng, kết hợp A* để khởi tạo quỹ đạo cơ sở và PSO để tinh chỉnh từng phân đoạn. Phần tiếp theo xây dựng hàm thích nghi tổng hợp gồm ba thành phần chuẩn hóa và cơ chế phạt hai ngưỡng an toàn. Phần thứ ba trình bày bốn cơ chế kỹ thuật cốt lõi: khởi tạo quần thể theo phân đoạn hình học, cập nhật thích nghi kết hợp SIW-TVAC-SOBL, làm mượt bằng Bezier, và quy trình tổng thể dạng mã giả. Các kết quả thực nghiệm kiểm chứng hiệu quả của phương pháp đề xuất sẽ được trình bày trong chương tiếp theo.",
  ),
];

// ── document ─────────────────────────────────────────────────────────────────
const doc = new Document({
  numbering: { config: [] },
  styles: {
    default: { document: { run: { font: "Times New Roman", size: 26 } } },
    paragraphStyles: [
      {
        id: "Heading1",
        name: "Heading 1",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 28, bold: true, font: "Times New Roman", color: "000000" },
        paragraph: { spacing: { before: 280, after: 160 }, outlineLevel: 0 },
      },
      {
        id: "Heading2",
        name: "Heading 2",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 26, bold: true, font: "Times New Roman", color: "000000" },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 1 },
      },
      {
        id: "Heading3",
        name: "Heading 3",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: {
          size: 26,
          bold: true,
          italics: true,
          font: "Times New Roman",
          color: "000000",
        },
        paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 2 },
      },
    ],
  },
  sections: [
    {
      properties: {
        page: {
          size: { width: 11906, height: 16838 },
          margin: { top: 1418, right: 1134, bottom: 1134, left: 1701 },
        },
      },
      children,
    },
  ],
});

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync("D:\DEV\_Projects\Tools\Chuong_3_Chinh_Sua.docx", buf);
  console.log("Done.");
});
