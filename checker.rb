class Citation
  attr_accessor :id, :issue_date, :violation_code, :violation_name, :amount, :plate_number
end


require 'mechanize'

agent = Mechanize.new
page = agent.get('https://prodpci.etimspayments.com/pbw/include/sanfrancisco/input.jsp')
plate_number = '6WAK359'

plate_form = page.form('inputForm')
plate_form.plateNumber = plate_number

# TODO: State plates other than california
# google_form.statePlate = 'California'

page = agent.submit(plate_form, plate_form.buttons.first)

if page.search('form[name=selectForm]').size > 0
  puts "Uh oh, you have a citation!"
  citationsTable = page.search('form[name=selectForm] table')[4]
  citationsTable.search('tr').each_with_index do |tableRow, index|
    columns = tableRow.search('td')
    if index == 0
      puts "The column text says #{columns[1].text}"
      puts "Skipping the first index!"
      next
    end
    citation = Citation.new()
    citation.id = columns[1].text
    citation.issue_date = columns[2].text
    citation.violation_code = columns[3].text
    citation.violation_name = columns[4].text
    citation.amount = columns[5].text
    citation.plate_number =
    pp citation
  end
else
  puts "Congratulations! You don't have any citations!"
end

